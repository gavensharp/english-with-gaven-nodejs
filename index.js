"use strict";

const path = require("path");
const dotenv = require("dotenv");

// Load backend env when starting from repository root.
dotenv.config({ path: path.resolve(__dirname, "backend/.env") });

const { startServer } = require("./backend/dist/server.js");

startServer().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
