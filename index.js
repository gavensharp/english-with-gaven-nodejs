"use strict";

const fs = require("fs");
const path = require("path");

const envPath = path.resolve(__dirname, ".env");
if (fs.existsSync(envPath)) {
  require("dotenv").config({ path: envPath });
}

const { startServer } = require("./backend/dist/server.js");

startServer().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
