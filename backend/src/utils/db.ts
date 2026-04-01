import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

type DbCheckStage = "connect" | "query";

export type DbCheckResult = {
  ok: boolean;
  stage: DbCheckStage;
  code?: string;
  message: string;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"], // Enable logging
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

function extractPrismaError(error: unknown) {
  const err = error as { code?: string; message?: string };
  return {
    code: err?.code || "UNKNOWN",
    message: err?.message || "Unknown database error",
  };
}

// Test database connection
export async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully!");
    console.log(
      `📊 Database: ${process.env.DATABASE_URL?.split("@")[1]?.split("?")[0] || "login_db"}`,
    );

    // Verify schema readiness with a simple query.
    const userCount = await prisma.user.count();
    console.log(`👥 Total users in database: ${userCount}`);

    return {
      ok: true,
      stage: "query",
      message: "Database connection and schema check passed",
    } as DbCheckResult;
  } catch (error) {
    const { code, message } = extractPrismaError(error);
    const schemaNotReady = code === "P2021" || code === "P2022";

    if (schemaNotReady) {
      console.error("⚠️  Database is reachable, but schema is not ready.");
      console.error(
        "⚠️  This usually means required tables/columns are missing. Run migrations before enabling DB-backed routes.",
      );
      console.error(`⚠️  Prisma code: ${code}`);

      return {
        ok: false,
        stage: "query",
        code,
        message,
      } as DbCheckResult;
    }

    console.error("❌ Database connection/authentication check failed.");
    console.error(
      "❌ Verify host, port, database name, username, password, and user host permissions.",
    );
    console.error(`❌ Prisma code: ${code}`);

    return {
      ok: false,
      stage: "connect",
      code,
      message,
    } as DbCheckResult;
  }
}

// Handle cleanup on app shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
  console.log("🔌 Database disconnected");
});
