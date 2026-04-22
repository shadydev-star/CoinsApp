// src/models/Post.js
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, maxlength: 500 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform(doc, ret) { ret.id = ret._id; delete ret._id; delete ret.__v; } },
  }
);

const postSchema = new mongoose.Schema(
  {
    user:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content:  { type: String, default: null, maxlength: 1000 },
    imageUrl: { type: String, default: null },
    game:     { type: mongoose.Schema.Types.ObjectId, ref: "Game", default: null },
    // Likes stored as array of user IDs – bounded to manageable size for a gaming app
    likes:    [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        ret.likeCount = ret.likes ? ret.likes.length : 0;
        ret.commentCount = ret.comments ? ret.comments.length : 0;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

postSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Post", postSchema);