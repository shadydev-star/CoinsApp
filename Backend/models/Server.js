// src/models/Server.js
const mongoose = require("mongoose");

const serverEventSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: null },
    scheduledAt: { type: Date, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform(doc, ret) { ret.id = ret._id; delete ret._id; delete ret.__v; } },
  }
);

const GAME_TYPES = ["PUBG_MOBILE", "EIGHT_BALL", "FIFA_PS5", "ONLINE_BROWSER", "OTHER"];

const serverSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true, minlength: 3, maxlength: 60 },
    description: { type: String, default: null, maxlength: 500 },
    isPublic:    { type: Boolean, default: true },
    gameType:    { type: String, required: true, enum: GAME_TYPES },
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    maxPlayers:  { type: Number, default: 100, min: 2, max: 1000 },
    logoUrl:     { type: String, default: null },
    members:     [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    events:      [serverEventSchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        ret.memberCount = ret.members ? ret.members.length : 0;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

serverSchema.index({ isPublic: 1, gameType: 1, createdAt: -1 });

module.exports = mongoose.model("Server", serverSchema);