// src/routes/moderation.routes.js
const router = require("express").Router();
const ctrl   = require("../controllers/moderation.controller");
const { authenticate, requireRole } = require("../middleware/auth");

router.use(authenticate);

// Any player can file a report
router.post("/report", ctrl.createReport);

// Moderator + Admin only
router.use(requireRole("MODERATOR", "ADMIN"));

router.get("/stats",                   ctrl.getStats);
router.get("/pending-games",           ctrl.getPendingGames);
router.post("/decide",                 ctrl.decide);
router.get("/reports",                 ctrl.getReports);
router.patch("/reports/:reportId",     ctrl.resolveReport);

module.exports = router;