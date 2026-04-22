// src/routes/profile.routes.js
const router = require("express").Router();
const ctrl   = require("../controllers/profile.controller");
const { authenticate } = require("../middleware/auth");
const { uploadAvatar } = require("../middleware/upload");

// All profile routes require authentication
router.use(authenticate);

router.get("/me",                      ctrl.getMe);
router.patch("/me",        uploadAvatar, ctrl.updateProfile);
router.get("/:userId",                 ctrl.getProfile);
router.post("/:userId/follow",         ctrl.followUser);
router.delete("/:userId/follow",       ctrl.unfollowUser);
router.get("/:userId/posts",           ctrl.getUserPosts);
router.get("/:userId/followers",       ctrl.getFollowers);
router.get("/:userId/following",       ctrl.getFollowing);
router.post("/posts/:postId/like",     ctrl.likePost);
router.post("/posts/:postId/comment",  ctrl.commentPost);

module.exports = router;