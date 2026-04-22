// src/controllers/game.controller.js
const { Game, User, Post } = require("../models");
const AppError = require("../utils/AppError");
const coinService = require("../services/coin.service");
const notifService = require("../services/notification.service");

// ── POST /api/game/start ──────────────────────────────────────────────────────
exports.startGame = async (req, res, next) => {
  try {
    const { serverId, opponentId, gameType, stakeAmount = 0 } = req.body;
    if (!serverId || !gameType) throw new AppError("serverId and gameType are required.", 400);

    if (stakeAmount > 0) {
      const me = await User.findById(req.user._id).select("coinBalance");
      if (me.coinBalance < stakeAmount) {
        throw new AppError("Insufficient coins for this stake amount.", 400);
      }
    }

    const game = await Game.create({
      server:  serverId,
      player1: req.user._id,
      player2: opponentId || null,
      gameType,
      stakeAmount,
      status: "PENDING",
    });

    await game.populate([
      { path: "player1", select: "username photoUrl coinBalance" },
      { path: "server",  select: "name gameType" },
    ]);

    if (opponentId) {
      await notifService.send(opponentId, {
        type:  "MATCH_INVITE",
        title: "You've been challenged! 🎮",
        body:  `${req.user.username} challenged you to ${gameType} for ${stakeAmount} coins.`,
        data:  { gameId: game._id },
      });
    }

    res.status(201).json({ status: "success", data: { game } });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/game/:gameId/accept ─────────────────────────────────────────────
exports.acceptGame = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.gameId);
    if (!game) throw new AppError("Game not found.", 404);
    if (game.status !== "PENDING") throw new AppError("This game is no longer pending.", 400);

    // If a specific opponent was set, enforce it
    if (game.player2 && game.player2.toString() !== req.user._id.toString()) {
      throw new AppError("This challenge was not sent to you.", 403);
    }

    if (game.stakeAmount > 0) {
      await coinService.escrowStake(
        game.player1,
        req.user._id,
        game.stakeAmount,
        game._id
      );
    }

    game.player2   = req.user._id;
    game.status    = "IN_PROGRESS";
    game.startedAt = new Date();
    await game.save();

    await game.populate([
      { path: "player1", select: "username photoUrl" },
      { path: "player2", select: "username photoUrl" },
    ]);

    await notifService.send(game.player1, {
      type:  "MATCH_INVITE",
      title: "Challenge Accepted! 🏁",
      body:  `${req.user.username} accepted your challenge. Game on!`,
      data:  { gameId: game._id },
    });

    res.status(200).json({ status: "success", data: { game } });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/game/submit_screenshot ─────────────────────────────────────────
exports.submitScreenshot = async (req, res, next) => {
  try {
    const { gameId } = req.body;
    if (!gameId) throw new AppError("gameId is required.", 400);

    const screenshotUrl = req.file
      ? `/${req.file.path}`
      : req.body.screenshotUrl;
    if (!screenshotUrl) throw new AppError("A screenshot file or URL is required.", 400);

    const game = await Game.findById(gameId);
    if (!game) throw new AppError("Game not found.", 404);
    if (game.status !== "IN_PROGRESS") throw new AppError("Game is not currently in progress.", 400);

    const isParticipant =
      game.player1.toString() === req.user._id.toString() ||
      (game.player2 && game.player2.toString() === req.user._id.toString());
    if (!isParticipant) throw new AppError("You are not a participant in this game.", 403);

    game.screenshotUrl = screenshotUrl;
    game.status = "AWAITING_VERIFICATION";
    await game.save();

    const opponentId =
      game.player1.toString() === req.user._id.toString()
        ? game.player2
        : game.player1;

    await notifService.send(opponentId, {
      type:  "GAME_RESULT",
      title: "Screenshot Submitted 📸",
      body:  "Your opponent submitted a result. Awaiting moderator verification.",
      data:  { gameId },
    });

    res.status(200).json({
      status: "success",
      data: { game, message: "Screenshot submitted for verification." },
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/game/:gameId/dispute ────────────────────────────────────────────
exports.disputeGame = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.gameId);
    if (!game) throw new AppError("Game not found.", 404);
    if (game.status !== "AWAITING_VERIFICATION") {
      throw new AppError("Only games awaiting verification can be disputed.", 400);
    }

    const isParticipant =
      game.player1.toString() === req.user._id.toString() ||
      (game.player2 && game.player2.toString() === req.user._id.toString());
    if (!isParticipant) throw new AppError("You are not a participant in this game.", 403);

    game.status = "DISPUTED";
    await game.save();

    res.status(200).json({ status: "success", data: { game } });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/game/:gameId/cancel ─────────────────────────────────────────────
exports.cancelGame = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.gameId);
    if (!game) throw new AppError("Game not found.", 404);

    const isPlayer1 = game.player1.toString() === req.user._id.toString();
    if (!isPlayer1 && req.user.role === "PLAYER") {
      throw new AppError("Only the challenger can cancel a pending game.", 403);
    }
    if (!["PENDING", "IN_PROGRESS"].includes(game.status)) {
      throw new AppError("This game cannot be cancelled.", 400);
    }

    // Refund stakes if game was in progress
    if (game.status === "IN_PROGRESS" && game.stakeAmount > 0 && game.player2) {
      await coinService.refundStake(game._id, game.player1, game.player2, game.stakeAmount);
    }

    game.status = "CANCELLED";
    await game.save();

    res.status(200).json({ status: "success", data: { game } });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/game/:gameId ─────────────────────────────────────────────────────
exports.getGame = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.gameId)
      .populate("player1", "username photoUrl coinBalance")
      .populate("player2", "username photoUrl coinBalance")
      .populate("server",  "name gameType")
      .populate("winner",  "username photoUrl");

    if (!game) throw new AppError("Game not found.", 404);
    res.status(200).json({ status: "success", data: { game } });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/game/history ─────────────────────────────────────────────────────
exports.getGameHistory = async (req, res, next) => {
  try {
    const page   = Math.max(1, Number(req.query.page   || 1));
    const limit  = Math.min(50, Number(req.query.limit || 20));
    const skip   = (page - 1) * limit;
    const { status, gameType } = req.query;

    const filter = {
      $or: [{ player1: req.user._id }, { player2: req.user._id }],
      ...(status   && { status }),
      ...(gameType && { gameType }),
    };

    const [games, total] = await Promise.all([
      Game.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("player1", "username photoUrl")
        .populate("player2", "username photoUrl")
        .populate("winner",  "username photoUrl"),
      Game.countDocuments(filter),
    ]);

    res.status(200).json({
      status: "success",
      data: { games, pagination: { page, limit, total, pages: Math.ceil(total / limit) } },
    });
  } catch (err) {
    next(err);
  }
};