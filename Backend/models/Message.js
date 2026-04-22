// src/models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender:        { type: mongoose.Schema.Types.ObjectId, ref: "User",   required: true },
    game:          { type: mongoose.Schema.Types.ObjectId, ref: "Game",   default: null },
    server:        { type: mongoose.Schema.Types.ObjectId, ref: "Server", default: null },
    content:       { type: String, default: null, maxlength: 2000 },
    screenshotUrl: { type: String, default: null },
    messageType:   { type: String, enum: ["TEXT", "COIN_OFFER", "SCREENSHOT", "SYSTEM"], default: "TEXT" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform(doc, ret) { ret.id = ret._id; delete ret._id; delete ret.__v; } },
  }
);

// One of game or server must be set
messageSchema.pre("validate", function (next) {
  if (!this.game && !this.server) {
    return next(new Error("Message must belong to a game or a server"));
  }
  next();
});

messageSchema.index({ game:   1, createdAt: 1 });
messageSchema.index({ server: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);