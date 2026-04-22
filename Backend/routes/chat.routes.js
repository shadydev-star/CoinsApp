// src/routes/chat.routes.js
const router = require("express").Router();
const ctrl   = require("../controllers/chat.controller");
const { authenticate } = require("../middleware/auth");
const { uploadScreenshot } = require("../middleware/upload");

router.use(authenticate);

router.get("/game/:gameId",          ctrl.getGameMessages);
router.get("/server/:serverId",      ctrl.getServerMessages);
router.post("/send", uploadScreenshot, ctrl.sendMessage);
router.delete("/message/:messageId", ctrl.deleteMessage);

module.exports = router;