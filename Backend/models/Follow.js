// src/models/Follow.js
const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    follower:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    following: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform(doc, ret) { ret.id = ret._id; delete ret._id; delete ret.__v; } },
  }
);

followSchema.index({ follower: 1, following: 1 }, { unique: true });
followSchema.index({ following: 1 }); // fast follower count

module.exports = mongoose.model("Follow", followSchema);