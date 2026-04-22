// src/controllers/profile.controller.js
const { User, Follow, Post, Game } = require("../models");
const AppError = require("../utils/AppError");

exports.getMe = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const [user, followerCount, followingCount, wins, losses] = await Promise.all([
      User.findById(userId).populate("badges"),
      Follow.countDocuments({ following: userId }),
      Follow.countDocuments({ follower: userId }),
      Game.countDocuments({ winner: userId, status: "COMPLETED" }),
      Game.countDocuments({ status: "COMPLETED", winner: { $ne: userId }, $or: [{ player1: userId }, { player2: userId }] }),
    ]);
    res.status(200).json({ status: "success", data: { user: { ...user.toJSON(), followerCount, followingCount, wins, losses } } });
  } catch (err) { next(err); }
};

exports.getProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const [user, followerCount, followingCount, wins, isFollowing] = await Promise.all([
      User.findById(userId).populate("badges"),
      Follow.countDocuments({ following: userId }),
      Follow.countDocuments({ follower: userId }),
      Game.countDocuments({ winner: userId, status: "COMPLETED" }),
      Follow.exists({ follower: req.user._id, following: userId }),
    ]);
    if (!user) throw new AppError("User not found.", 404);
    res.status(200).json({ status: "success", data: { user: { ...user.toJSON(), followerCount, followingCount, wins }, isFollowing: !!isFollowing } });
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { username, bio, photoUrl } = req.body;
    if (username) {
      const taken = await User.findOne({ username, _id: { $ne: req.user._id } });
      if (taken) throw new AppError("Username is already taken.", 409);
    }
    const updates = {};
    if (username !== undefined) updates.username = username;
    if (bio !== undefined)      updates.bio      = bio;
    if (photoUrl !== undefined) updates.photoUrl = photoUrl;
    if (req.file)               updates.photoUrl = `/${req.file.path}`;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.status(200).json({ status: "success", data: { user } });
  } catch (err) { next(err); }
};

exports.followUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (userId === req.user._id.toString()) throw new AppError("You cannot follow yourself.", 400);
    const target = await User.findById(userId);
    if (!target) throw new AppError("User not found.", 404);
    await Follow.findOneAndUpdate({ follower: req.user._id, following: userId }, { follower: req.user._id, following: userId }, { upsert: true });
    res.status(200).json({ status: "success", message: `Now following ${target.username}.` });
  } catch (err) { next(err); }
};

exports.unfollowUser = async (req, res, next) => {
  try {
    await Follow.deleteOne({ follower: req.user._id, following: req.params.userId });
    res.status(200).json({ status: "success", message: "Unfollowed successfully." });
  } catch (err) { next(err); }
};

exports.getUserPosts = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Number(req.query.limit || 20));
    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      Post.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("user", "username photoUrl"),
      Post.countDocuments({ user: userId }),
    ]);
    res.status(200).json({ status: "success", data: { posts, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } });
  } catch (err) { next(err); }
};

exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) throw new AppError("Post not found.", 404);
    const alreadyLiked = post.likes.some((id) => id.toString() === req.user._id.toString());
    if (alreadyLiked) { post.likes.pull(req.user._id); } else { post.likes.addToSet(req.user._id); }
    await post.save();
    res.status(200).json({ status: "success", data: { liked: !alreadyLiked, likeCount: post.likes.length } });
  } catch (err) { next(err); }
};

exports.commentPost = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) throw new AppError("Comment content is required.", 400);
    const post = await Post.findById(req.params.postId);
    if (!post) throw new AppError("Post not found.", 404);
    post.comments.push({ user: req.user._id, content });
    await post.save();
    const newComment = post.comments[post.comments.length - 1];
    res.status(201).json({ status: "success", data: { comment: newComment } });
  } catch (err) { next(err); }
};

exports.getFollowers = async (req, res, next) => {
  try {
    const followers = await Follow.find({ following: req.params.userId }).populate("follower", "username photoUrl").sort({ createdAt: -1 });
    res.status(200).json({ status: "success", data: { followers } });
  } catch (err) { next(err); }
};

exports.getFollowing = async (req, res, next) => {
  try {
    const following = await Follow.find({ follower: req.params.userId }).populate("following", "username photoUrl").sort({ createdAt: -1 });
    res.status(200).json({ status: "success", data: { following } });
  } catch (err) { next(err); }
};