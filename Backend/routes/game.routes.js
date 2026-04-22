// src/routes/game.routes.js
const router = require("express").Router();
const ctrl   = require("../controllers/game.controller");
const { authenticate } = require("../middleware/auth");
const { uploadScreenshot } = require("../middleware/upload");

router.use(authenticate);

router.get("/history",                        ctrl.getGameHistory);
router.post("/start",                         ctrl.startGame);
router.post("/submit_screenshot", uploadScreenshot, ctrl.submitScreenshot);
router.get("/:gameId",                        ctrl.getGame);
router.post("/:gameId/accept",                ctrl.acceptGame);
router.post("/:gameId/dispute",               ctrl.disputeGame);
router.post("/:gameId/cancel",                ctrl.cancelGame);

module.exports = router;