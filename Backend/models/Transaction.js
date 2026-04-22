// src/models/Transaction.js
const mongoose = require("mongoose");

const TRANSACTION_TYPES = [
  "DEPOSIT",
  "WITHDRAWAL",
  "TRANSFER_IN",
  "TRANSFER_OUT",
  "GAME_WIN",
  "GAME_STAKE",
  "REFUND",
];

const transactionSchema = new mongoose.Schema(
  {
    user:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type:        { type: String, required: true, enum: TRANSACTION_TYPES },
    amount:      { type: Number, required: true, min: 0 },
    status:      { type: String, enum: ["PENDING", "COMPLETED", "FAILED", "REVERSED"], default: "PENDING" },
    description: { type: String, default: null },
    reference:   { type: String, default: null, sparse: true },
    game:        { type: mongoose.Schema.Types.ObjectId, ref: "Game", default: null },
    meta:        { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform(doc, ret) { ret.id = ret._id; delete ret._id; delete ret.__v; } },
  }
);

transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ game: 1 });
transactionSchema.index({ reference: 1 }, { sparse: true });

module.exports = mongoose.model("Transaction", transactionSchema);