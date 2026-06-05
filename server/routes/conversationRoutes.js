import express from "express";
import {
  getConversations,
  createConversation,
  deleteConversation,
  getConversationById,
} from "../controllers/conversationController.js";

const { verifyToken } = require("../middleware/verifytoken");

const router = express.Router();
router.get("/", verifyToken, getConversations);
router.post("/", verifyToken, createConversation);
router.delete("/:conversationId", verifyToken, deleteConversation);
router.get("/:conversationId", verifyToken, getConversationById);

export default router;