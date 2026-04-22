// src/controllers/chat.controller.js
const { Message, Game, Server } = require("../models");
const AppError = require("../utils/AppError");

// ── GET /api/chat/game/:gameId ────────────────────────────────────────────────
exports.getGameMessages = async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const page  = Math.max(1, Number(req.query.page  || 1));
    const limit = Math.min(100, Number(req.query.limit || 50));
    const skip  = (page - 1) * limit;

    const game = await Game.findById(gameId);
    if (!game) throw new AppError("Game not found.", 404);

    const isParticipant =
      game.player1.toString() === req.user._id.toString() ||
      (game.player2 && game.player2.toString() === req.user._id.toString());
    if (!isParticipant) throw new AppError("You are not a participant in this game.", 403);

    const [messages, total] = await Promise.all([
      Message.find({ game: gameId })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .populate("sender", "username photoUrl"),
      Message.countDocuments({ game: gameId }),
    ]);

    res.status(200).json({
      status: "success",
      data: { messages, pagination: { page, limit, total } },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/chat/server/:serverId ────────────────────────────────────────────
exports.getServerMessages = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const page  = Math.max(1, Number(req.query.page  || 1));
    const limit = Math.min(100, Number(req.query.limit || 50));
    const skip  = (page - 1) * limit;

    const server = await Server.findById(serverId);
    if (!server) throw new AppError("Server not found.", 404);

    const isMember = server.members.some(
      (m) => m.toString() === req.user._id.toString()
    );
    if (!isMember) throw new AppError("You are not a member of this server.", 403);

    const [messages, total] = await Promise.all([
      Message.find({ server: serverId })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .populate("sender", "username photoUrl"),
      Message.countDocuments({ server: serverId }),
    ]);

    res.status(200).json({
      status: "success",
      data: { messages, pagination: { page, limit, total } },
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/chat/send  (REST fallback — prefer Socket.io for real-time) ─────
exports.sendMessage = async (req, res, next) => {
  try {
    const { gameId, serverId, content, messageType, metadata } = req.body;
    if (!gameId && !serverId) throw new AppError("gameId or serverId is required.", 400);
    if (!content && messageType === "TEXT") throw new AppError("Message content is required.", 400);

    const screenshotUrl = req.file ? `/${req.file.path}` : req.body.screenshotUrl;

    const message = await Message.create({
      sender:        req.user._id,
      game:          gameId   || null,
      server:        serverId || null,
      content:       content  || null,
      screenshotUrl: screenshotUrl || null,
      messageType:   messageType || "TEXT",
      metadata:      metadata || null,
    });

    await message.populate("sender", "username photoUrl");

    res.status(201).json({ status: "success", data: { message } });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/chat/message/:messageId ───────────────────────────────────────
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) throw new AppError("Message not found.", 404);

    const isOwner = message.sender.toString() === req.user._id.toString();
    const isMod   = ["MODERATOR", "ADMIN"].includes(req.user.role);
    if (!isOwner && !isMod) throw new AppError("You cannot delete this message.", 403);

    await message.deleteOne();
    res.status(200).json({ status: "success", data: { message: "Message deleted." } });
  } catch (err) {
    next(err);
  }
};