// src/app.js
const express    = require("express");
const cors       = require("cors");
const helmet     = require("helmet");
const morgan     = require("morgan");
const rateLimit  = require("express-rate-limit");

const authRoutes         = require("./routes/auth.routes");
const profileRoutes      = require("./routes/profile.routes");
const coinRoutes         = require("./routes/coin.routes");
const gameRoutes         = require("./routes/game.routes");
const chatRoutes         = require("./routes/chat.routes");
const serverRoutes       = require("./routes/server.routes");
const notificationRoutes = require("./routes/notification.routes");
const moderationRoutes   = require("./routes/moderation.routes");
const { errorHandler }   = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(",") || "*", credentials: true }));

const apiLimiter  = rateLimit({ windowMs: 15*60*1000, max: 200, standardHeaders: true, legacyHeaders: false,
  message: { success: false, error: "Too many requests, please try again later." } });
const authLimiter = rateLimit({ windowMs: 15*60*1000, max: 20,
  message: { success: false, error: "Too many auth attempts, please try again later." } });

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

app.get("/health", (req, res) =>
  res.json({ success: true, status: "ok", timestamp: new Date().toISOString() })
);

app.use("/api/auth",          authLimiter, authRoutes);
app.use("/api/profile",       apiLimiter,  profileRoutes);
app.use("/api/coins",         apiLimiter,  coinRoutes);
app.use("/api/game",          apiLimiter,  gameRoutes);
app.use("/api/chat",          apiLimiter,  chatRoutes);
app.use("/api/server",        apiLimiter,  serverRoutes);
app.use("/api/notifications", apiLimiter,  notificationRoutes);
app.use("/api/moderation",    apiLimiter,  moderationRoutes);

app.use((req, res) => res.status(404).json({ success: false, error: `Cannot ${req.method} ${req.originalUrl}` }));
app.use(errorHandler);

module.exports = app;