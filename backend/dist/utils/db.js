"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.testDatabaseConnection = testDatabaseConnection;
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_mariadb_1 = require("@prisma/adapter-mariadb");
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set. Check backend/.env for local dev.");
}
const adapter = new adapter_mariadb_1.PrismaMariaDb(databaseUrl);
const globalForPrisma = global;
exports.prisma = globalForPrisma.prisma ||
    new client_1.PrismaClient({
        adapter,
        log: ["query", "error", "warn"], // Enable logging
    });
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = exports.prisma;
// Test database connection
async function testDatabaseConnection() {
    try {
        await exports.prisma.$connect();
        console.log("✅ Database connected successfully!");
        console.log(`📊 Database: ${process.env.DATABASE_URL?.split("@")[1]?.split("?")[0] || "login_db"}`);
        // Optional: Run a simple query to verify
        const userCount = await exports.prisma.user.count();
        console.log(`👥 Total users in database: ${userCount}`);
        return true;
    }
    catch (error) {
        console.error("❌ Database connection failed:", error);
        return false;
    }
}
// Handle cleanup on app shutdown
process.on("beforeExit", async () => {
    await exports.prisma.$disconnect();
    console.log("🔌 Database disconnected");
});
//# sourceMappingURL=db.js.map