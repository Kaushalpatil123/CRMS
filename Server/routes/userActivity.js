const express = require("express");
const router = express.Router();
const userActivityController = require("../controllers/userActivity");
const { validateToken } = require('../middlewares/token.js');

router.post("/login", validateToken, userActivityController.userLogin);
router.post("/logout", validateToken, userActivityController.userLogout);
router.post("/start-break", validateToken, userActivityController.startBreak);
router.post("/end-break", validateToken, userActivityController.endBreak);
router.post("/startIdleTime", validateToken, userActivityController.startIdleTime);
router.post("/endIdleTime", validateToken, userActivityController.endIdleTime);
router.get("/all-activities", userActivityController.getAllUsersActivity);
router.get("/activity/:userId", userActivityController.getUserActivityById);

module.exports = router;