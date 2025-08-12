const express = require("express");
const router = express.Router();
const { getnovuNotification2 } = require("../Controllers/notification.controller");
const jwtMW = require("../middlewares/auth");


// router.get("/:subscriberId", jwtMW.authentication, getnovuNotification2);

module.exports = router;