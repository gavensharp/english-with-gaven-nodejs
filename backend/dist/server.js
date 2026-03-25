"use strict";
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
require("dotenv/config");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const next_1 = __importDefault(require("next"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const lessons_1 = __importDefault(require("./routes/lessons"));
const availability_1 = __importDefault(require("./routes/availability"));
const admin_1 = __importDefault(require("./routes/admin"));
const agora_1 = __importDefault(require("./routes/agora"));
const db_1 = require("./utils/db");
const API_PREFIXES = [
    "/api/auth",
    "/api/users",
    "/api/lessons",
    "/api/availability",
    "/api/admin",
    "/api/agora",
    "/api/health",
];
function createApp() {
    const app = (0, express_1.default)();
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
    // Routes
    app.use("/api/auth", auth_1.default);
    app.use("/api/users", user_1.default);
    app.use("/api/lessons", lessons_1.default);
    app.use("/api/availability", availability_1.default);
    app.use("/api/admin", admin_1.default);
    app.use("/api/agora", agora_1.default);
    // Health check
    app.get("/api/health", (req, res) => {
        res.json({ status: "OK", timestamp: new Date().toISOString() });
    });
    return app;
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
    const frontendOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
    const shouldMountNext = process.env.MOUNT_NEXT_IN_BACKEND === "true" ||
        process.env.NODE_ENV === "production";
    // Test database connection first
    const dbConnected = await (0, db_1.testDatabaseConnection)();
    if (!dbConnected) {
        console.error("⚠️  Server starting without database connection");
        console.error("⚠️  Please check your DATABASE_URL in .env file");
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