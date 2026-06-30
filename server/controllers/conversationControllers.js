const { default: mongoose } = require('mongoose');
const Conversation = require('../model/conversation.js');
const message = require('../model/message.js');
const Message = require("../model/message.js");
const user = require('../model/user.js');

const getConversations = async (req, res) => {
  try {
    // const userId = req.user._id;
     const userId = new mongoose.Types.ObjectId(req.user._id);

    const conversations = await Conversation.aggregate([
      { $match: { participants: userId } },
      {
        $addFields: {
          myDeletedEntry: {
            $arrayElemAt: [
              { $filter: {
                  input: "$deletedBy",
                  cond: { $eq: ["$$this.user", userId] }
              }},
              0
            ]
          }
        }
      },
      {
        $match: {
          $or: [
            { myDeletedEntry: { $exists: false } }, // never deleted
            { $expr: { $lt: ["$myDeletedEntry.deletedAt", "$updatedAt"] } } // deleted before latest activity
          ]
        }
      },
      { $sort: { updatedAt: -1 } }
    ]);
  // console.log("simple aggregate:", conversations);

    await Conversation.populate(conversations, { path: "participants", select: "name email" });

    res.status(200).json({ conversations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const createConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (conversation) {
      console.log("conversation is already exist");
      conversation = await conversation.populate("participants", "name email");
      return res.status(200).json({ conversation }); // ✅ no deletedAt needed anymore
    }

    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
    conversation = await conversation.populate("participants", "name email");

    res.status(201).json({ conversation });

  } catch (err) {
    console.log("this is full error of the conversation", err);
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

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (!conversation.participants.some(p => p.toString() === userId.toString())) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const existingEntry = conversation.deletedBy.find(
      (d) => d.user.toString() === userId.toString()
    );

    if (existingEntry) {
      // ✅ update existing entry's timestamp
      existingEntry.deletedAt = new Date();
      conversation.lastMessage = "";
    } else {
      // ✅ first time deleting — push new entry
      conversation.deletedBy.push({ user: userId, deletedAt: new Date() });
      conversation.lastMessage = "";
    }

    await conversation.save();

    console.log("deletedBy after save:", conversation.deletedBy);

    res.status(200).json({
      conversation,
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