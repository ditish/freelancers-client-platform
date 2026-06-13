const express = require ("express");
const {
  getConversations,
  createConversation,
  deleteConversation,
  getConversationById,
}= require ("../controllers/conversationControllers");

const { verifyToken } = require("../middleware/verifytoken");

const router = express.Router();
router.get("/getConversations", verifyToken, getConversations);
router.post("/create", verifyToken, createConversation);
router.delete("/:conversationId", verifyToken, deleteConversation);
router.get("/:conversationId", verifyToken, getConversationById);

module.exports = router;