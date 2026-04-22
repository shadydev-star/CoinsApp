// src/controllers/moderation.controller.js
const { Game, Report, Post } = require("../models");
const AppError = require("../utils/AppError");
const coinService = require("../services/coin.service");
const notifService = require("../services/notification.service");

// ── POST /api/moderation/decide ───────────────────────────────────────────────
exports.decide = async (req, res, next) => {
  try {
    const { gameId, winnerId, decision, note } = req.body;
    if (!gameId || !decision) throw new AppError("gameId and decision are required.", 400);

    const game = await Game.findById(gameId)
      .populate("player1", "username")
      .populate("player2", "username");

    if (!game) throw new AppError("Game not found.", 404);
    if (!["AWAITING_VERIFICATION", "DISPUTED"].includes(game.status)) {
      throw new AppError("Game is not pending a moderation decision.", 400);
    }

    // Validate the winner is one of the players
    if (winnerId) {
      const validWinner =
        winnerId === game.player1._id.toString() ||
        (game.player2 && winnerId === game.player2._id.toString());
      if (!validWinner) throw new AppError("Winner must be one of the game's players.", 400);
    }

    // Settle coins if there is a stake
    if (game.stakeAmount > 0 && winnerId) {
      await coinService.settleStake(game._id, winnerId, game.stakeAmount);
    }

    game.status      = "COMPLETED";
    game.winner      = winnerId || null;
    game.result      = decision;
    game.completedAt = new Date();
    await game.save();

    // Auto-post result on winner's profile
    if (winnerId) {
      const prize = game.stakeAmount * 2;
      await Post.create({
        user:    winnerId,
        content: `Won a ${game.gameType} match${prize > 0 ? ` and earned ${prize} coins` : ""}! 🏆`,
        game:    game._id,
      });
    }

    const loserId = winnerId
      ? (winnerId === game.player1._id.toString() ? game.player2?._id : game.player1._id)
      : null;

    await Promise.all([
      winnerId && notifService.send(winnerId, {
        type:  "GAME_RESULT",
        title: "You Won! 🏆",
        body:  `Moderator confirmed your ${game.gameType} win.${game.stakeAmount > 0 ? ` +${game.stakeAmount * 2} coins added.` : ""}`,
        data:  { gameId },
      }),
      loserId && notifService.send(loserId, {
        type:  "GAME_RESULT",
        title: "Game Result Declared",
        body:  `A moderator has declared the result for your ${game.gameType} match.`,
        data:  { gameId },
      }),
    ].filter(Boolean));

    res.status(200).json({ status: "success", data: { game } });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/moderation/report ───────────────────────────────────────────────
exports.createReport = async (req, res, next) => {
  try {
    const { reportedId, gameId, reason } = req.body;
    if (!reportedId || !reason) throw new AppError("reportedId and reason are required.", 400);
    if (reportedId === req.user._id.toString()) {
      throw new AppError("You cannot report yourself.", 400);
    }

    const report = await Report.create({
      reporter: req.user._id,
      reported: reportedId,
      game:     gameId || null,
      reason,
    });

    res.status(201).json({ status: "success", data: { report } });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/moderation/reports ───────────────────────────────────────────────
exports.getReports = async (req, res, next) => {
  try {
    const page   = Math.max(1, Number(req.query.page  || 1));
    const limit  = Math.min(50, Number(req.query.limit || 20));
    const skip   = (page - 1) * limit;
    const { status } = req.query;

    const filter = status ? { status } : {};

    const [reports, total] = await Promise.all([
      Report.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("reporter", "username photoUrl")
        .populate("reported", "username photoUrl")
        .populate("game",     "gameType status stakeAmount"),
      Report.countDocuments(filter),
    ]);

    res.status(200).json({
      status: "success",
      data: { reports, pagination: { page, limit, total, pages: Math.ceil(total / limit) } },
    });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/moderation/reports/:reportId ───────────────────────────────────
exports.resolveReport = async (req, res, next) => {
  try {
    const { status, decision, decisionNote } = req.body;
    const isResolved = ["RESOLVED", "DISMISSED"].includes(status);

    const report = await Report.findByIdAndUpdate(
      req.params.reportId,
      {
        status,
        decision:     decision     || null,
        decisionNote: decisionNote || null,
        moderator:    req.user._id,
        resolvedAt:   isResolved ? new Date() : null,
      },
      { new: true }
    );

    if (!report) throw new AppError("Report not found.", 404);

    res.status(200).json({ status: "success", data: { report } });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/moderation/pending-games ─────────────────────────────────────────
exports.getPendingGames = async (req, res, next) => {
  try {
    const games = await Game.find({
      status: { $in: ["AWAITING_VERIFICATION", "DISPUTED"] },
    })
      .sort({ updatedAt: 1 })   // oldest first so nothing is ignored
      .populate("player1", "username photoUrl")
      .populate("player2", "username photoUrl")
      .populate("server",  "name gameType");

    res.status(200).json({
      status: "success",
      data: { games, total: games.length },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/moderation/stats ─────────────────────────────────────────────────
exports.getStats = async (req, res, next) => {
  try {
    const [openReports, pendingGames, disputedGames] = await Promise.all([
      Report.countDocuments({ status: "OPEN" }),
      Game.countDocuments({ status: "AWAITING_VERIFICATION" }),
      Game.countDocuments({ status: "DISPUTED" }),
    ]);

    res.status(200).json({
      status: "success",
      data: { openReports, pendingGames, disputedGames },
    });
  } catch (err) {
    next(err);
  }
};