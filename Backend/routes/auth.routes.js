// src/routes/auth.routes.js
const router = require("express").Router();
const ctrl   = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth");

// Public
router.post("/register",        ctrl.register);
router.post("/login",           ctrl.login);
router.post("/refresh",         ctrl.refresh);

// Protected
router.post("/change-password", authenticate, ctrl.changePassword);

module.exports = router;