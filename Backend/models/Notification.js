// src/models/Notification.js
const mongoose = require("mongoose");

const NOTIFICATION_TYPES = [
  "MATCH_INVITE",
  "PLAYER_READY",
  "COIN_RECEIVED",
  "COMMENT",
  "LIKE",
  "SERVER_EVENT",
  "GAME_RESULT",
  "MODERATION",
];

const notificationSchema = new mongoose.Schema(
  {
    user:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type:   { type: String, required: true, enum: NOTIFICATION_TYPES },
    title:  { type: String, required: true },
    body:   { type: String, required: true },
    data:   { type: mongoose.Schema.Types.Mixed, default: {} },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform(doc, ret) { ret.id = ret._id; delete ret._id; delete ret.__v; } },
  }
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);