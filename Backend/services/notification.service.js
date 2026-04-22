// src/services/notification.service.js
const { Notification } = require("../models");
const logger = require("../utils/logger");

let _io = null;

/**
 * Called once from sockets/index.js to give this service access to the io instance.
 */
exports.setIO = (io) => { _io = io; };

/**
 * Persist a notification in MongoDB and push it to the user's socket room.
 *
 * @param {string|ObjectId} userId
 * @param {{ type, title, body, data? }} payload
 */
exports.send = async (userId, { type, title, body, data = {} }) => {
  try {
    const notification = await Notification.create({ user: userId, type, title, body, data });

    if (_io) {
      _io.to(`user:${userId}`).emit("notification", notification.toJSON());
    }

    return notification;
  } catch (err) {
    logger.error(`Notification send failed for user ${userId}: ${err.message}`);
  }
};