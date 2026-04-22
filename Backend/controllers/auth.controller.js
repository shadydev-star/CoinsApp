// src/controllers/auth.controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { AppError } = require("../utils/AppError");

// ── Helpers ──────────────────────────────────────────────────────────────────

const signTokens = (userId) => ({
  accessToken: jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  ),
  refreshToken: jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  ),
});

// ── Controllers ───────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Body: { username, email, password }
 */
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw new AppError("username, email and password are required", 400);
    }
    if (password.length < 6) {
      throw new AppError("Password must be at least 6 characters", 400);
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) throw new AppError("Username or email is already taken", 409);

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ username, email, passwordHash });

    const tokens = signTokens(user._id);

    res.status(201).json({ success: true, user, ...tokens });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new AppError("email and password are required", 400);

    const user = await User.findByCredentials(email, password);
    if (!user) throw new AppError("Invalid email or password", 401);

    const tokens = signTokens(user._id);

    res.json({ success: true, user, ...tokens });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/refresh
 * Body: { refreshToken }
 */
exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new AppError("refreshToken is required", 400);

    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      throw new AppError("Invalid or expired refresh token", 401);
    }

    // Ensure user still exists
    const user = await User.findById(payload.userId).select("_id");
    if (!user) throw new AppError("User not found", 401);

    res.json({ success: true, ...signTokens(user._id) });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/change-password   (requires authentication)
 * Body: { currentPassword, newPassword }
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw new AppError("currentPassword and newPassword are required", 400);
    }
    if (newPassword.length < 6) {
      throw new AppError("New password must be at least 6 characters", 400);
    }

    const user = await User.findById(req.user._id).select("+passwordHash");
    const valid = await user.comparePassword(currentPassword);
    if (!valid) throw new AppError("Current password is incorrect", 400);

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};