// src/models/Badge.js
const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    iconUrl:     { type: String, required: true },
    condition:   { type: String, default: null }, // e.g. "WIN_10_GAMES"
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform(doc, ret) { ret.id = ret._id; delete ret._id; delete ret.__v; } },
  }
);

module.exports = mongoose.model("Badge", badgeSchema);