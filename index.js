"use strict";

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Canonical VPS flow: load only root .env at runtime.
[".env"].forEach((relativePath) => {
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
