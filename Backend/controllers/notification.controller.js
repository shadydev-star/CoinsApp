// src/controllers/notification.controller.js
const { Notification } = require("../models");
const AppError = require("../utils/AppError");

// ── GET /api/notifications/fetch ─────────────────────────────────────────────
exports.fetch = async (req, res, next) => {
  try {
    const page      = Math.max(1, Number(req.query.page  || 1));
    const limit     = Math.min(100, Number(req.query.limit || 30));
    const skip      = (page - 1) * limit;
    const unreadOnly = req.query.unreadOnly === "true";

    const filter = {
      user: req.user._id,
      ...(unreadOnly && { isRead: false }),
    };

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments(filter),
      Notification.countDocuments({ user: req.user._id, isRead: false }),
    ]);

    res.status(200).json({
      status: "success",
      data: {
        notifications,
        unreadCount,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/notifications/:id/read ────────────────────────────────────────
exports.markRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) throw new AppError("Notification not found.", 404);

    res.status(200).json({ status: "success", data: { notification } });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/notifications/read-all ────────────────────────────────────────
exports.markAllRead = async (req, res, next) => {
  try {
    const { modifiedCount } = await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true }
    );
    res.status(200).json({
      status: "success",
      data: { message: `${modifiedCount} notifications marked as read.` },
    });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/notifications/:id ─────────────────────────────────────────────
exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!notification) throw new AppError("Notification not found.", 404);

    res.status(200).json({ status: "success", data: { message: "Notification deleted." } });
  } catch (err) {
    next(err);
  }
};