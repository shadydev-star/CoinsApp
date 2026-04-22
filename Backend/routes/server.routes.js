// src/routes/server.routes.js
const router = require("express").Router();
const ctrl   = require("../controllers/server.controller");
const { authenticate } = require("../middleware/auth");

router.use(authenticate);

router.get("/",                    ctrl.listServers);
router.get("/my",                  ctrl.myServers);
router.post("/create",             ctrl.createServer);
router.post("/join",               ctrl.joinServer);
router.get("/:serverId",           ctrl.getServer);
router.get("/:serverId/members",   ctrl.getMembers);
router.post("/:serverId/event",    ctrl.createEvent);
router.delete("/:serverId/leave",  ctrl.leaveServer);

module.exports = router;