"use strict";

const { startServer } = require("./backend/dist/server.js");

startServer().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
