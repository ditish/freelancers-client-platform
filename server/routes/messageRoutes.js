import express from "express";
import {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
} from "../controllers/messageController.js";

const { verifyToken } = require("../middleware/verifytoken");


const router = express.Router();

router.post("/", verifyToken, sendMessage);
router.get("/:conversationId", verifyToken, getMessages);
router.patch("/:messageId", verifyToken, editMessage);
router.delete("/:messageId", verifyToken, deleteMessage);

export default router;