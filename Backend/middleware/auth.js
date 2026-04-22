// src/middleware/auth.js
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { AppError } = require("../utils/AppError");

/**
 * Verifies Bearer JWT and attaches req.user.
 */
exports.authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new AppError("No token provided", 401);
    }

    const token = header.split(" ")[1];
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      throw new AppError("Invalid or expired token", 401);
    }

    const user = await User.findById(payload.userId).select("_id username role coinBalance");
    if (!user) throw new AppError("User no longer exists", 401);

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Guard specific roles. Must come after authenticate.
 * Usage: requireRole("MODERATOR", "ADMIN")
 */
exports.requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return next(new AppError("Not authenticated", 401));
  if (!roles.includes(req.user.role)) {
    return next(new AppError("You do not have permission to perform this action", 403));
  }
  next();
};