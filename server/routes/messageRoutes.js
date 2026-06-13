 const express =  require( "express");
const {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
} = require( "../controllers/messageControllers");

const { verifyToken } = require("../middleware/verifytoken");
const router = express.Router();
router.post("/sendMessage", verifyToken, sendMessage);
router.get("/:conversationId", verifyToken, getMessages);
router.patch("/:messageId", verifyToken, editMessage);
router.delete("/:messageId", verifyToken, deleteMessage);

module.exports = router;