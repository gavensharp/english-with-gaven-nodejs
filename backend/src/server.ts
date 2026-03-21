import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import fs from "fs";
import next from "next";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import lessonRoutes from "./routes/lessons";
import availabilityRoutes from "./routes/availability";
import adminRoutes from "./routes/admin";
import agoraRoutes from "./routes/agora";
import { testDatabaseConnection } from "./utils/db";

const API_PREFIXES = [
  "/api/auth",
  "/api/users",
  "/api/lessons",
  "/api/availability",
  "/api/admin",
  "/api/agora",
  "/api/health",
];

export function createApp() {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
    }),
  );
  app.use(express.json());

  // Serve static files (uploaded photos)
  app.use(
    "/uploads",
    express.static(path.join(__dirname, "../public/uploads")),
  );

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/lessons", lessonRoutes);
  app.use("/api/availability", availabilityRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/agora", agoraRoutes);

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
  });

  return app;
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
  const shouldMountNext =
    process.env.MOUNT_NEXT_IN_BACKEND === "true" ||
    process.env.NODE_ENV === "production";

  // Test database connection first
  const dbConnected = await testDatabaseConnection();

  if (!dbConnected) {
    console.error("⚠️  Server starting without database connection");
    console.error("⚠️  Please check your DATABASE_URL in .env file");
  }

  if (shouldMountNext) {
    await mountNextHandler(app);
  } else {
    console.log(
      "ℹ️  Skipping Next.js mount in backend dev mode (set MOUNT_NEXT_IN_BACKEND=true to enable)",
    );
  }
  registerErrorHandler(app);

  const server = app.listen(PORT, "127.0.0.1", () => {
    console.log("\n🚀 ================================");
    console.log(`🚀 Express Backend running on http://127.0.0.1:${PORT}`);
    console.log(
      `🔐 CORS enabled for: ${process.env.FRONTEND_URL || "http://localhost:3000"}`,
    );
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
