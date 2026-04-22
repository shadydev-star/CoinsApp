// src/routes/notification.routes.js
const router = require("express").Router();
const ctrl   = require("../controllers/notification.controller");
const { authenticate } = require("../middleware/auth");

router.use(authenticate);

router.get("/fetch",          ctrl.fetch);
router.patch("/read-all",     ctrl.markAllRead);
router.patch("/:id/read",     ctrl.markRead);
router.delete("/:id",         ctrl.deleteNotification);

module.exports = router;