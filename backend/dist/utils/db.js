"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.testDatabaseConnection = testDatabaseConnection;
const client_1 = require("@prisma/client");
const globalForPrisma = global;
exports.prisma = globalForPrisma.prisma ||
    new client_1.PrismaClient({
        log: ["query", "error", "warn"], // Enable logging
    });
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = exports.prisma;
function extractPrismaError(error) {
    const err = error;
    return {
        code: err?.code || "UNKNOWN",
        message: err?.message || "Unknown database error",
    };
}
// Test database connection
async function testDatabaseConnection() {
    try {
        await exports.prisma.$connect();
        console.log("✅ Database connected successfully!");
        console.log(`📊 Database: ${process.env.DATABASE_URL?.split("@")[1]?.split("?")[0] || "login_db"}`);
        // Verify schema readiness with a simple query.
        const userCount = await exports.prisma.user.count();
        console.log(`👥 Total users in database: ${userCount}`);
        return {
            ok: true,
            stage: "query",
            message: "Database connection and schema check passed",
        };
    }
    catch (error) {
        const { code, message } = extractPrismaError(error);
        const schemaNotReady = code === "P2021" || code === "P2022";
        if (schemaNotReady) {
            console.error("⚠️  Database is reachable, but schema is not ready.");
            console.error("⚠️  This usually means required tables/columns are missing. Run migrations before enabling DB-backed routes.");
            console.error(`⚠️  Prisma code: ${code}`);
            return {
                ok: false,
                stage: "query",
                code,
                message,
            };
        }
        console.error("❌ Database connection/authentication check failed.");
        console.error("❌ Verify host, port, database name, username, password, and user host permissions.");
        console.error(`❌ Prisma code: ${code}`);
        return {
            ok: false,
            stage: "connect",
            code,
            message,
        };
    }
}
// Handle cleanup on app shutdown
process.on("beforeExit", async () => {
    await exports.prisma.$disconnect();
    console.log("🔌 Database disconnected");
});
//# sourceMappingURL=db.js.map