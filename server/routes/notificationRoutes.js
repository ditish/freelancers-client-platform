const express = require("express");
const router = express.Router();
const { getNotifications, markAllRead, deleteNotification } = require("../controllers/notificationControllers");
const { verifyToken } = require("../middleware/verifytoken");

router.get("/getnotifications", verifyToken, getNotifications);          
router.patch("/mark-read", verifyToken, markAllRead); 
router.delete("/delete/:notificationId", verifyToken, deleteNotification);

module.exports = router;