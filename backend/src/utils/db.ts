import "dotenv/config";
import type { PrismaClient as PrismaClientType } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set. Check backend/.env for local dev.");
}

const adapter = new PrismaMariaDb(databaseUrl);

const globalForPrisma = global as unknown as { prisma: PrismaClientType };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ["query", "error", "warn"], // Enable logging
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Test database connection
export async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully!");
    console.log(
      `📊 Database: ${process.env.DATABASE_URL?.split("@")[1]?.split("?")[0] || "login_db"}`,
    );

    // Optional: Run a simple query to verify
    const userCount = await prisma.user.count();
    console.log(`👥 Total users in database: ${userCount}`);

    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}

// Handle cleanup on app shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
  console.log("🔌 Database disconnected");
});
