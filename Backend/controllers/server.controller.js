// src/controllers/server.controller.js
const { Server } = require("../models");
const AppError = require("../utils/AppError");
const notifService = require("../services/notification.service");

// ── GET /api/server ───────────────────────────────────────────────────────────
exports.listServers = async (req, res, next) => {
  try {
    const page     = Math.max(1, Number(req.query.page  || 1));
    const limit    = Math.min(50, Number(req.query.limit || 20));
    const skip     = (page - 1) * limit;
    const { gameType, search } = req.query;

    const filter = {
      isPublic: true,
      ...(gameType && { gameType }),
      ...(search  && { name: { $regex: search, $options: "i" } }),
    };

    const [servers, total] = await Promise.all([
      Server.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "username photoUrl")
        .select("-events -members"),   // members fetched separately
      Server.countDocuments(filter),
    ]);

    res.status(200).json({
      status: "success",
      data: { servers, pagination: { page, limit, total, pages: Math.ceil(total / limit) } },
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/server/create ───────────────────────────────────────────────────
exports.createServer = async (req, res, next) => {
  try {
    const { name, description, gameType, isPublic, maxPlayers, logoUrl } = req.body;
    if (!name || !gameType) throw new AppError("name and gameType are required.", 400);

    const server = await Server.create({
      name,
      description,
      gameType,
      isPublic: isPublic ?? true,
      maxPlayers: maxPlayers || 100,
      logoUrl,
      createdBy: req.user._id,
      members:   [req.user._id],   // creator auto-joins
    });

    await server.populate("createdBy", "username photoUrl");
    res.status(201).json({ status: "success", data: { server } });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/server/join ─────────────────────────────────────────────────────
exports.joinServer = async (req, res, next) => {
  try {
    const { serverId } = req.body;
    if (!serverId) throw new AppError("serverId is required.", 400);

    const server = await Server.findById(serverId);
    if (!server) throw new AppError("Server not found.", 404);
    if (!server.isPublic) throw new AppError("This is a private server.", 403);
    if (server.members.length >= server.maxPlayers) {
      throw new AppError("Server is full.", 400);
    }

    const alreadyMember = server.members.some(
      (m) => m.toString() === req.user._id.toString()
    );
    if (!alreadyMember) {
      server.members.push(req.user._id);
      await server.save();
    }

    res.status(200).json({
      status: "success",
      data: { message: `Joined ${server.name}.`, memberCount: server.members.length },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/server/:serverId ─────────────────────────────────────────────────
exports.getServer = async (req, res, next) => {
  try {
    const server = await Server.findById(req.params.serverId)
      .populate("createdBy", "username photoUrl");

    if (!server) throw new AppError("Server not found.", 404);

    const now = new Date();
    const upcomingEvents = server.events
      .filter((e) => e.scheduledAt > now)
      .sort((a, b) => a.scheduledAt - b.scheduledAt)
      .slice(0, 5);

    res.status(200).json({
      status: "success",
      data: {
        server: {
          ...server.toJSON(),
          memberCount: server.members.length,
          upcomingEvents,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/server/:serverId/members ─────────────────────────────────────────
exports.getMembers = async (req, res, next) => {
  try {
    const page  = Math.max(1, Number(req.query.page  || 1));
    const limit = Math.min(100, Number(req.query.limit || 50));
    const skip  = (page - 1) * limit;

    const server = await Server.findById(req.params.serverId)
      .populate({
        path: "members",
        select: "username photoUrl coinBalance",
        options: { skip, limit },
      });

    if (!server) throw new AppError("Server not found.", 404);

    res.status(200).json({
      status: "success",
      data: {
        members: server.members,
        pagination: { page, limit, total: server.members.length },
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/server/:serverId/event ──────────────────────────────────────────
exports.createEvent = async (req, res, next) => {
  try {
    const { title, description, scheduledAt } = req.body;
    if (!title || !scheduledAt) throw new AppError("title and scheduledAt are required.", 400);

    const server = await Server.findById(req.params.serverId);
    if (!server) throw new AppError("Server not found.", 404);

    const isOwner = server.createdBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role === "PLAYER") {
      throw new AppError("Only the server owner can schedule events.", 403);
    }

    server.events.push({ title, description, scheduledAt: new Date(scheduledAt) });
    await server.save();

    const newEvent = server.events[server.events.length - 1];

    // Notify all members
    await Promise.all(
      server.members.map((memberId) =>
        notifService.send(memberId, {
          type:  "SERVER_EVENT",
          title: `📅 New Event: ${title}`,
          body:  `${server.name} has a new event scheduled.`,
          data:  { serverId: server._id, eventId: newEvent._id },
        })
      )
    );

    res.status(201).json({ status: "success", data: { event: newEvent } });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/server/:serverId/leave ────────────────────────────────────────
exports.leaveServer = async (req, res, next) => {
  try {
    const server = await Server.findById(req.params.serverId);
    if (!server) throw new AppError("Server not found.", 404);

    if (server.createdBy.toString() === req.user._id.toString()) {
      throw new AppError("Server owner cannot leave. Transfer ownership or delete the server.", 400);
    }

    await Server.findByIdAndUpdate(
      req.params.serverId,
      { $pull: { members: req.user._id } }
    );

    res.status(200).json({ status: "success", data: { message: "Left server successfully." } });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/server/my ────────────────────────────────────────────────────────
exports.myServers = async (req, res, next) => {
  try {
    const servers = await Server.find({ members: req.user._id })
      .populate("createdBy", "username photoUrl")
      .select("-events")
      .sort({ createdAt: -1 });

    res.status(200).json({ status: "success", data: { servers } });
  } catch (err) {
    next(err);
  }
};