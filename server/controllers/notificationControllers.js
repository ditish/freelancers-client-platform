// controllers/notificationController.js
const notification = require("../model/notification");
const Notification = require("../model/notification");

// GET all notifications for logged in user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 }); // ← newest first
    console.log("this is notification from backend", notifications);
    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PATCH mark all notifications as read
exports.markAllRead = async (req, res) => {
  try {
     const result = await Notification.updateMany(
      { userId: req.user._id, isRead: false }, // ← find unread
      { isRead: true }                         // ← mark as read
    );
    console.log("this is marked read ", result);
    return res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByIdAndDelete(notificationId);
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    return res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};