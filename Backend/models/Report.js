// src/models/Report.js
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reporter:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reported:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    game:         { type: mongoose.Schema.Types.ObjectId, ref: "Game", default: null },
    reason:       { type: String, required: true, maxlength: 1000 },
    status:       { type: String, enum: ["OPEN", "UNDER_REVIEW", "RESOLVED", "DISMISSED"], default: "OPEN" },
    moderator:    { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    decision:     { type: String, default: null },
    decisionNote: { type: String, default: null },
    resolvedAt:   { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform(doc, ret) { ret.id = ret._id; delete ret._id; delete ret.__v; } },
  }
);

reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ reporter: 1 });
reportSchema.index({ reported: 1 });

module.exports = mongoose.model("Report", reportSchema);