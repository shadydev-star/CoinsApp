// src/sockets/index.js
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { Message } = require("../models");
const notifService = require("../services/notification.service");
const logger = require("../utils/logger");

let io;

exports.initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: process.env.ALLOWED_ORIGINS?.split(",") || "*", credentials: true },
    pingTimeout: 60000, pingInterval: 25000,
  });

  notifService.setIO(io);

  // JWT auth middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = payload.userId;
      next();
    } catch { next(new Error("Invalid or expired token")); }
  });

  io.on("connection", (socket) => {
    logger.info(`[Socket] Connected: ${socket.userId}`);

    // Personal notification room
    socket.join(`user:${socket.userId}`);

    // Room management
    socket.on("join:game",    ({ gameId })   => socket.join(`game:${gameId}`));
    socket.on("leave:game",   ({ gameId })   => socket.leave(`game:${gameId}`));
    socket.on("join:server",  ({ serverId }) => socket.join(`server:${serverId}`));
    socket.on("leave:server", ({ serverId }) => socket.leave(`server:${serverId}`));

    // Send a chat message (persisted + broadcast)
    socket.on("message:send", async (data, ack) => {
      try {
        const { gameId, serverId, content, messageType, screenshotUrl } = data;
        if (!gameId && !serverId) return ack?.({ error: "gameId or serverId required" });

        const message = await Message.create({
          sender: socket.userId,
          game:   gameId        || null,
          server: serverId      || null,
          content: content      || null,
          messageType: messageType   || "TEXT",
          screenshotUrl: screenshotUrl || null,
        });
        await message.populate("sender", "username photoUrl");

        const room = gameId ? `game:${gameId}` : `server:${serverId}`;
        io.to(room).emit("message:new", message.toJSON());
        ack?.({ success: true, message: message.toJSON() });
      } catch (err) {
        logger.error(`[Socket] message:send: ${err.message}`);
        ack?.({ error: "Failed to send message" });
      }
    });

    // Coin stake offer in game chat
    socket.on("coin:offer", async ({ gameId, toUserId, amount }, ack) => {
      try {
        const message = await Message.create({
          sender: socket.userId, game: gameId, messageType: "COIN_OFFER",
          content: JSON.stringify({ amount, fromUserId: socket.userId }),
        });
        await message.populate("sender", "username photoUrl");

        io.to(`game:${gameId}`).emit("message:new", message.toJSON());
        io.to(`user:${toUserId}`).emit("coin:offer:received", { gameId, amount, from: socket.userId });
        ack?.({ success: true });
      } catch (err) {
        logger.error(`[Socket] coin:offer: ${err.message}`);
        ack?.({ error: "Failed to send offer" });
      }
    });

    // Player ready broadcast in server room
    socket.on("player:ready", ({ serverId }) => {
      io.to(`server:${serverId}`).emit("player:ready", {
        userId: socket.userId, serverId, timestamp: new Date().toISOString(),
      });
    });

    // Typing indicators
    socket.on("typing:start", ({ gameId }) => socket.to(`game:${gameId}`).emit("typing:start", { userId: socket.userId }));
    socket.on("typing:stop",  ({ gameId }) => socket.to(`game:${gameId}`).emit("typing:stop",  { userId: socket.userId }));

    socket.on("disconnect", (reason) => logger.info(`[Socket] Disconnected: ${socket.userId} (${reason})`));
  });

  logger.info("[Socket] Socket.io initialised");
  return io;
};

exports.getIO = () => {
  if (!io) throw new Error("Socket.io not initialised yet");
  return io;
};