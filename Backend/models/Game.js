// src/models/Game.js
const mongoose = require("mongoose");

const GAME_TYPES = ["PUBG_MOBILE", "EIGHT_BALL", "FIFA_PS5", "ONLINE_BROWSER", "OTHER"];
const GAME_STATUSES = [
  "PENDING",
  "ACCEPTED",
  "IN_PROGRESS",
  "AWAITING_VERIFICATION",
  "DISPUTED",
  "COMPLETED",
  "CANCELLED",
];

const gameSchema = new mongoose.Schema(
  {
    server:        { type: mongoose.Schema.Types.ObjectId, ref: "Server", required: true },
    player1:       { type: mongoose.Schema.Types.ObjectId, ref: "User",   required: true },
    player2:       { type: mongoose.Schema.Types.ObjectId, ref: "User",   default: null },
    gameType:      { type: String, required: true, enum: GAME_TYPES },
    stakeAmount:   { type: Number, default: 0, min: 0 },
    status:        { type: String, enum: GAME_STATUSES, default: "PENDING" },
    winner:        { type: mongoose.Schema.Types.ObjectId, ref: "User",   default: null },
    screenshotUrl: { type: String, default: null },
    result:        { type: String, default: null },
    startedAt:     { type: Date, default: null },
    completedAt:   { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform(doc, ret) { ret.id = ret._id; delete ret._id; delete ret.__v; } },
  }
);

gameSchema.index({ player1: 1, createdAt: -1 });
gameSchema.index({ player2: 1, createdAt: -1 });
gameSchema.index({ status: 1, createdAt: -1 });
gameSchema.index({ server: 1, status: 1 });

module.exports = mongoose.model("Game", gameSchema);