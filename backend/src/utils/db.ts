import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
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
