// src/routes/coin.routes.js
const router = require("express").Router();
const ctrl   = require("../controllers/coin.controller");
const { authenticate } = require("../middleware/auth");

router.use(authenticate);

router.get("/balance",   ctrl.getBalance);
router.get("/history",   ctrl.getHistory);
router.post("/deposit",  ctrl.deposit);
router.post("/withdraw", ctrl.withdraw);
router.post("/transfer", ctrl.transfer);

module.exports = router;