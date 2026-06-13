const message = require("../model/message");
const conversation = require("../model/conversation")


 const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    const newMessage = await message.create({
      conversationId,
      sender: req.user._id, // from auth middleware
      text,
    });
     const populatedMessage = await newMessage.populate("sender", "name email");

    // update conversation metadata (important)
    await conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
      updatedAt: Date.now(),
    });

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.log("full erorr",error)
    res.status(500).json({ message: error.message });
  }
};
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
  

    const messages = await message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate("sender", "name email")
    
     
    
        if (!messages || messages.length === 0) {
      return res.status(200).json({
        messages: [],
        isEmpty: true,
        message: "No messages yet. Start the conversation!",
      });
    }


    res.status(200).json({
      messages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

 const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { text } = req.body;

    const message = await message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // optional security: only sender can edit
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    message.text = text;
    message.isEdited = true;

    await message.save();

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // only sender can delete
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    message.isDeleted = true;
    message.text = ""; // optional: clear text
    await message.save();

    res.status(200).json({
      message: "Message deleted successfully",
      deletedMessageId: messageId,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  sendMessage,getMessages,editMessage,deleteMessage
}

