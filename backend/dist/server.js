"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
exports.startServer = startServer;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const next_1 = __importDefault(require("next"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const API_PREFIXES = ["/api", "/api/health"];
function isLeanHostingTestMode() {
    return process.env.LEAN_HOSTING_TEST === "true";
}
function createApp() {
    const app = (0, express_1.default)();
    app.locals.runtimeDbStatus = {
        state: "not-checked",
    };
    const frontendOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
    app.disable("x-powered-by");
    app.set("trust proxy", 1);
    // Middleware
    app.use((0, compression_1.default)());
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: { policy: "cross-origin" },
    }));
    app.use((0, cors_1.default)({
        origin: (origin, callback) => {
            if (!origin || frontendOrigins.includes(origin)) {
                callback(null, true);
                return;
            }
            callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    }));
    app.use("/api", (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 300,
        standardHeaders: true,
        legacyHeaders: false,
    }));
    app.use(express_1.default.json({ limit: "1mb" }));
    // Serve static files (uploaded photos)
    app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../public/uploads"), {
        maxAge: "7d",
        etag: true,
        immutable: false,
    }));
    // Health check
    app.get("/api/health", (req, res) => {
        const runtimeDbStatus = req.app.locals.runtimeDbStatus ||
            { state: "not-checked" };
        res.json({
            status: "OK",
            mode: isLeanHostingTestMode() ? "lean-hosting-test" : "full",
            db: runtimeDbStatus,
            timestamp: new Date().toISOString(),
        });
    });
    return app;
}
async function mountApiRoutes(app) {
    const [authModule, userModule, lessonModule, availabilityModule, adminModule, agoraModule,] = await Promise.all([
        Promise.resolve().then(() => __importStar(require("./routes/auth"))),
        Promise.resolve().then(() => __importStar(require("./routes/user"))),
        Promise.resolve().then(() => __importStar(require("./routes/lessons"))),
        Promise.resolve().then(() => __importStar(require("./routes/availability"))),
        Promise.resolve().then(() => __importStar(require("./routes/admin"))),
        Promise.resolve().then(() => __importStar(require("./routes/agora"))),
    ]);
    app.use("/api/auth", authModule.default);
    app.use("/api/users", userModule.default);
    app.use("/api/lessons", lessonModule.default);
    app.use("/api/availability", availabilityModule.default);
    app.use("/api/admin", adminModule.default);
    app.use("/api/agora", agoraModule.default);
}
function registerErrorHandler(app) {
    app.use((err, req, res, next) => {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal server error" });
    });
}
function resolveNextAppDir() {
    const envDir = process.env.NEXT_APP_DIR;
    const candidates = [
        envDir ? path_1.default.resolve(envDir) : "",
        // In compiled runtime (__dirname = backend/dist/src), this resolves to project/frontend.
        path_1.default.resolve(__dirname, "../../../../frontend"),
        path_1.default.resolve(process.cwd(), "frontend"),
        path_1.default.resolve(process.cwd(), "../frontend"),
        path_1.default.resolve(__dirname, "../../frontend"),
        path_1.default.resolve(__dirname, "../../../frontend"),
    ].filter(Boolean);
    const validDir = candidates.find((dir) => {
        return (fs_1.default.existsSync(path_1.default.join(dir, "app")) ||
            fs_1.default.existsSync(path_1.default.join(dir, "src/app")) ||
            fs_1.default.existsSync(path_1.default.join(dir, "pages")));
    });
    if (!validDir) {
        throw new Error("Unable to locate frontend Next.js directory. Set NEXT_APP_DIR to your frontend path.");
    }
    return validDir;
}
async function mountNextHandler(app) {
    const isDev = process.env.NODE_ENV !== "production";
    const nextAppDir = resolveNextAppDir();
    console.log(`📁 Next app directory: ${nextAppDir}`);
    // Next/Tailwind should resolve project config from frontend directory.
    process.chdir(nextAppDir);
    const nextApp = (0, next_1.default)({ dev: isDev, dir: nextAppDir });
    await nextApp.prepare();
    const nextRequestHandler = nextApp.getRequestHandler();
    app.use((req, res, nextMiddleware) => {
        const isExpressApiRoute = API_PREFIXES.some((prefix) => req.path === prefix || req.path.startsWith(`${prefix}/`));
        if (isExpressApiRoute ||
            req.path === "/uploads" ||
            req.path.startsWith("/uploads/")) {
            nextMiddleware();
            return;
        }
        void nextRequestHandler(req, res).catch((err) => {
            nextMiddleware(err);
        });
    });
}
// Start server with database connection test
async function startServer() {
    const app = createApp();
    const PORT = parseInt(process.env.PORT || "3001", 10);
    const HOST = process.env.HOST || "0.0.0.0";
    const leanHostingTestMode = isLeanHostingTestMode();
    const frontendOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
    const shouldMountNext = process.env.MOUNT_NEXT_IN_BACKEND === "true" ||
        process.env.NODE_ENV === "production";
    if (leanHostingTestMode) {
        app.locals.runtimeDbStatus = {
            state: "skipped",
            message: "LEAN_HOSTING_TEST=true",
        };
        console.log("🧪 LEAN_HOSTING_TEST=true: skipping DB check and API route mount");
        app.get("/api/smoke", (req, res) => {
            res.json({
                status: "OK",
                service: "express",
                mode: "lean-hosting-test",
            });
        });
    }
    else {
        await mountApiRoutes(app);
        // Lazy import keeps lean smoke boot free from Prisma initialization.
        const { testDatabaseConnection } = await Promise.resolve().then(() => __importStar(require("./utils/db")));
        const dbCheck = await testDatabaseConnection();
        app.locals.runtimeDbStatus = dbCheck.ok
            ? {
                state: "connected",
                message: dbCheck.message,
            }
            : {
                state: dbCheck.stage === "query" ? "schema-not-ready" : "connect-failed",
                code: dbCheck.code,
                message: dbCheck.message,
            };
        if (!dbCheck.ok) {
            console.error("⚠️  Server starting without database connection");
            if (dbCheck.stage === "query") {
                console.error("⚠️  Database credentials look reachable, but schema appears incomplete.");
                console.error("⚠️  Run prisma migrations, then redeploy and re-test DB-backed routes.");
            }
            else {
                console.error("⚠️  Please check runtime DATABASE_URL and database user host permissions.");
                console.error("⚠️  For Hostinger deployments, update DATABASE_URL in the Node.js app Environment Variables panel.");
            }
            console.error(`⚠️  DB check code: ${dbCheck.code || "UNKNOWN"}`);
            console.error(`⚠️  DB check message: ${dbCheck.message}`);
        }
    }
    if (shouldMountNext) {
        await mountNextHandler(app);
    }
    else {
        console.log("ℹ️  Skipping Next.js mount in backend dev mode (set MOUNT_NEXT_IN_BACKEND=true to enable)");
    }
    registerErrorHandler(app);
    const server = app.listen(PORT, HOST, () => {
        console.log("\n🚀 ================================");
        console.log(`🚀 Express Backend running on http://${HOST}:${PORT}`);
        console.log(`🔐 CORS enabled for: ${frontendOrigins.join(", ")}`);
        console.log("🚀 ================================\n");
    });
    // Handle errors
    server.on("error", (err) => {
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
//# sourceMappingURL=server.js.map