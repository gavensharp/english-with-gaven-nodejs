import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import path from "path";
import fs from "fs";
import next from "next";
import rateLimit from "express-rate-limit";

const API_PREFIXES = ["/api", "/api/health"];

type RuntimeDbStatus = {
  state:
    | "not-checked"
    | "skipped"
    | "connected"
    | "connect-failed"
    | "schema-not-ready";
  code?: string;
  message?: string;
};

function isLeanHostingTestMode() {
  return process.env.LEAN_HOSTING_TEST === "true";
}

export function createApp() {
  const app = express();
  app.locals.runtimeDbStatus = {
    state: "not-checked",
  } as RuntimeDbStatus;
  const frontendOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  // Middleware
  app.use(compression());
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || frontendOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    }),
  );
  app.use(
    "/api",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );
  app.use(express.json({ limit: "1mb" }));

  // Serve static files (uploaded photos)
  app.use(
    "/uploads",
    express.static(path.join(__dirname, "../public/uploads"), {
      maxAge: "7d",
      etag: true,
      immutable: false,
    }),
  );

  // Health check
  app.get("/api/health", (req, res) => {
    const runtimeDbStatus =
      (req.app.locals.runtimeDbStatus as RuntimeDbStatus) ||
      ({ state: "not-checked" } as RuntimeDbStatus);

    res.json({
      status: "OK",
      mode: isLeanHostingTestMode() ? "lean-hosting-test" : "full",
      db: runtimeDbStatus,
      timestamp: new Date().toISOString(),
    });
  });

  return app;
}

async function mountApiRoutes(app: express.Express) {
  const [
    authModule,
    userModule,
    lessonModule,
    availabilityModule,
    adminModule,
    agoraModule,
  ] = await Promise.all([
    import("./routes/auth"),
    import("./routes/user"),
    import("./routes/lessons"),
    import("./routes/availability"),
    import("./routes/admin"),
    import("./routes/agora"),
  ]);

  app.use("/api/auth", authModule.default);
  app.use("/api/users", userModule.default);
  app.use("/api/lessons", lessonModule.default);
  app.use("/api/availability", availabilityModule.default);
  app.use("/api/admin", adminModule.default);
  app.use("/api/agora", agoraModule.default);
}

function registerErrorHandler(app: express.Express) {
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  });
}

function resolveNextAppDir() {
  const envDir = process.env.NEXT_APP_DIR;
  const candidates = [
    envDir ? path.resolve(envDir) : "",
    // In compiled runtime (__dirname = backend/dist/src), this resolves to project/frontend.
    path.resolve(__dirname, "../../../../frontend"),
    path.resolve(process.cwd(), "frontend"),
    path.resolve(process.cwd(), "../frontend"),
    path.resolve(__dirname, "../../frontend"),
    path.resolve(__dirname, "../../../frontend"),
  ].filter(Boolean);

  const validDir = candidates.find((dir) => {
    return (
      fs.existsSync(path.join(dir, "app")) ||
      fs.existsSync(path.join(dir, "src/app")) ||
      fs.existsSync(path.join(dir, "pages"))
    );
  });

  if (!validDir) {
    throw new Error(
      "Unable to locate frontend Next.js directory. Set NEXT_APP_DIR to your frontend path.",
    );
  }

  return validDir;
}

async function mountNextHandler(app: express.Express) {
  const isDev = process.env.NODE_ENV !== "production";
  const nextAppDir = resolveNextAppDir();

  console.log(`📁 Next app directory: ${nextAppDir}`);

  // Next/Tailwind should resolve project config from frontend directory.
  process.chdir(nextAppDir);

  const nextApp = next({ dev: isDev, dir: nextAppDir });

  await nextApp.prepare();

  const nextRequestHandler = nextApp.getRequestHandler();

  app.use((req, res, nextMiddleware) => {
    const isExpressApiRoute = API_PREFIXES.some(
      (prefix) => req.path === prefix || req.path.startsWith(`${prefix}/`),
    );

    if (
      isExpressApiRoute ||
      req.path === "/uploads" ||
      req.path.startsWith("/uploads/")
    ) {
      nextMiddleware();
      return;
    }

    void nextRequestHandler(req, res).catch((err) => {
      nextMiddleware(err);
    });
  });
}

// Start server with database connection test
export async function startServer() {
  const app = createApp();
  const PORT = parseInt(process.env.PORT || "3001", 10);
  const HOST = process.env.HOST || "0.0.0.0";
  const leanHostingTestMode = isLeanHostingTestMode();
  const frontendOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const shouldMountNext =
    process.env.MOUNT_NEXT_IN_BACKEND === "true" ||
    process.env.NODE_ENV === "production";

  if (leanHostingTestMode) {
    app.locals.runtimeDbStatus = {
      state: "skipped",
      message: "LEAN_HOSTING_TEST=true",
    } as RuntimeDbStatus;

    console.log(
      "🧪 LEAN_HOSTING_TEST=true: skipping DB check and API route mount",
    );
    app.get("/api/smoke", (req, res) => {
      res.json({
        status: "OK",
        service: "express",
        mode: "lean-hosting-test",
      });
    });
  } else {
    await mountApiRoutes(app);

    // Lazy import keeps lean smoke boot free from Prisma initialization.
    const { testDatabaseConnection } = await import("./utils/db");
    const dbCheck = await testDatabaseConnection();

    app.locals.runtimeDbStatus = dbCheck.ok
      ? ({
          state: "connected",
          message: dbCheck.message,
        } as RuntimeDbStatus)
      : ({
          state:
            dbCheck.stage === "query" ? "schema-not-ready" : "connect-failed",
          code: dbCheck.code,
          message: dbCheck.message,
        } as RuntimeDbStatus);

    if (!dbCheck.ok) {
      console.error("⚠️  Server starting without database connection");
      if (dbCheck.stage === "query") {
        console.error(
          "⚠️  Database credentials look reachable, but schema appears incomplete.",
        );
        console.error(
          "⚠️  Run prisma migrations, then redeploy and re-test DB-backed routes.",
        );
      } else {
        console.error(
          "⚠️  Please check runtime DATABASE_URL and database user host permissions.",
        );
        console.error(
          "⚠️  For Hostinger deployments, update DATABASE_URL in the Node.js app Environment Variables panel.",
        );
      }
      console.error(`⚠️  DB check code: ${dbCheck.code || "UNKNOWN"}`);
      console.error(`⚠️  DB check message: ${dbCheck.message}`);
    }
  }

  if (shouldMountNext) {
    await mountNextHandler(app);
  } else {
    console.log(
      "ℹ️  Skipping Next.js mount in backend dev mode (set MOUNT_NEXT_IN_BACKEND=true to enable)",
    );
  }
  registerErrorHandler(app);

  const server = app.listen(PORT, HOST, () => {
    console.log("\n🚀 ================================");
    console.log(`🚀 Express Backend running on http://${HOST}:${PORT}`);
    console.log(`🔐 CORS enabled for: ${frontendOrigins.join(", ")}`);
    console.log("🚀 ================================\n");
  });

  // Handle errors
  server.on("error", (err: any) => {
    console.error("❌ Server error:", err);
    process.exit(1);
  });

  // Handle shutdown
  process.on("SIGTERM", async () => {
    console.log("\n🛑 SIGTERM received, shutting down gracefully...");
    server.close(() => {
      console.log("✅ Server closed");
      process.exit(0);
    });
  });

  process.on("SIGINT", async () => {
    console.log("\n🛑 SIGINT received, shutting down gracefully...");
    server.close(() => {
      console.log("✅ Server closed");
      process.exit(0);
    });
  });
}

if (require.main === module) {
  startServer();
}
