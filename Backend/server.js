// src/server.js
require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { initSocket } = require("./sockets");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 5000;

const start = async () => {
  // 1. Connect to MongoDB first
  await connectDB();

  // 2. Boot HTTP server
  const httpServer = http.createServer(app);

  // 3. Attach Socket.io
  initSocket(httpServer);

  httpServer.listen(PORT, () => {
    logger.info(`🚀 COINS APP Server running on port ${PORT}`);
    logger.info(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  });
};

start();

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});