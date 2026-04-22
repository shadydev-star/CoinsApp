// src/middleware/errorHandler.js
const logger = require("../utils/logger");

// Handle Mongoose validation & cast errors cleanly
const normalise = (err) => {
  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return { statusCode: 422, message: messages.join(", ") };
  }
  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return { statusCode: 409, message: `${field} is already taken` };
  }
  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    return { statusCode: 400, message: `Invalid ${err.path}: ${err.value}` };
  }
  return { statusCode: err.statusCode || 500, message: err.message || "Internal Server Error" };
};

exports.errorHandler = (err, req, res, next) => {
  const { statusCode, message } = normalise(err);

  if (statusCode >= 500) {
    logger.error(`[${req.method}] ${req.originalUrl} → ${err.stack || err.message}`);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && statusCode >= 500 && { stack: err.stack }),
  });
};