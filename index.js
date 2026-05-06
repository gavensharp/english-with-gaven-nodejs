"use strict";

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load local overrides in dev, keep VPS .env for production.
const envFiles =
  process.env.NODE_ENV === "production" ? [".env"] : [".env.local", ".env"];

envFiles.forEach((relativePath) => {
  const envPath = path.resolve(__dirname, relativePath);
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
});

const { startServer } = require("./backend/dist/server.js");

startServer().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
