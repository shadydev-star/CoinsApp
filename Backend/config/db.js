// src/config/db.js
const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME || "coins_app",
    });
    logger.info(`MongoDB connected → ${conn.connection.host} / ${conn.connection.name}`);
  } catch (err) {
    logger.error(`MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () =>
  logger.warn("MongoDB disconnected")
);
mongoose.connection.on("reconnected", () =>
  logger.info("MongoDB reconnected")
);

if (process.env.NODE_ENV === "development") {
  mongoose.set("debug", (coll, method) =>
    logger.info(`Mongoose → ${coll}.${method}`)
  );
}

module.exports = connectDB;