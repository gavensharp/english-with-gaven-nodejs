import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import lessonRoutes from "./routes/lessons";
import availabilityRoutes from "./routes/availability";
import adminRoutes from "./routes/admin";
import agoraRoutes from "./routes/agora";
import { testDatabaseConnection } from "./utils/db";

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

  // Error handling middleware
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}

// Start server with database connection test
export async function startServer() {
  const app = createApp();
  const PORT = parseInt(process.env.PORT || "3001", 10);

  // Test database connection first
  const dbConnected = await testDatabaseConnection();

  if (!dbConnected) {
    console.error("⚠️  Server starting without database connection");
    console.error("⚠️  Please check your DATABASE_URL in .env file");
  }

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
