const Conversation = require('../model/conversation.js');
const message = require('../model/message.js');
const Message = require("../model/message.js");
const user = require('../model/user.js');

const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name email")
      .sort({ updatedAt: -1 });
    res.status(200).json({
      conversations,
    });
  
  } catch (err) {
   console.log("this is conversation err", err);
    res.status(500).json({ message: err.message });
  }
};
const createConversation = async (req, res) => {
   try {
     const {receiverId
   } = req.body;
    const senderId = req.user._id;

    // check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    });

     if (conversation) {
       conversation = await conversation.populate("participants", "name email");
      return res.status(200).json(conversation);
    }

    // create new conversation
     conversation = await Conversation.create({
       participants: [senderId, receiverId],
     })
    conversation = await conversation.populate("participants", "name email");
    res.status(201).json(conversation);
  
  } catch (err) {
    console.log("this is full error of the conversation",err )
    res.status(500).json({ message: err.message });
  }
};

 const getConversationById = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(
      conversationId
    ).populate("participants", "name email");

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

 const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findById(
      conversationId
    );

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    // check user belongs to conversation
    if (
      !conversation.participants.includes(userId)
    ) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    // delete conversation
    await Conversation.findByIdAndDelete(
      conversationId
    );

    // delete all messages in that conversation
    await Message.deleteMany({ conversationId });

    res.status(200).json({
      message: "Conversation deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const updateLastConversation = async (req, res) => {
  const { conversationId } = req.body;
  await user.findByIdAndUpdate(userId, {
    lastOpenedConversation: conversationId
  });
  return res.status(200).json({ success: true });
};

module.exports = {
  getConversationById, getConversations,createConversation,deleteConversation,updateLastConversation
}