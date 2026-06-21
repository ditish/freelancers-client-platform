const message = require("../model/message");
const conversation = require("../model/conversation")


 const sendMessage = async (req, res) => {
  try {
    const { conversationId, text,replyTo } = req.body;

    const newMessage = await message.create({
      conversationId,
      sender: req.user._id, // from auth middleware
      replyTo: replyTo || null,
      text,
    });
   const populatedMessage = await message
      .findById(newMessage._id)
      .populate("sender", "name email")
      .populate({
        path: "replyTo",
        populate: {
          path: "sender",
          select: "name _id",
        },
      })

    // update conversation metadata (important)
    await conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
      updatedAt: Date.now(),
    });

    console.log("this is populatedMessage", populatedMessage);

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
      .populate({
    path: "replyTo",
    populate: { path: "sender", select: "name" }
  });
    
     
    
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
    const { text,conversationId } = req.body;
   const Foundmessage = await message.findById(messageId);

    if (!Foundmessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    // optional security: only sender can edit
    if (Foundmessage.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    Foundmessage.text = text;
  Foundmessage.isEdited = true;

    await Foundmessage.save();
 await Foundmessage.populate("sender", "name email");
await Foundmessage.populate({
  path: "replyTo",
  populate: { path: "sender", select: "name" }
});
   await conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
      updatedAt: Date.now(),
    });

    res.status(200).json(
      Foundmessage
    );
 // update conversation metadata (important)
  

  } catch (error) {
    console.log("full error on edit", error);
    res.status(500).json({ message: error.message });
  }
};
const deleteMessage = async (req, res) => {
  try {
    const { messageId, } = req.params;
    const { conversationId } = req.body;

    const Message = await message.findById(messageId);

    if (!Message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // only sender can delete
    if (Message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    Message.isDeleted = true;
    Message.text = ""; // optional: clear text
    await Message.save();
    await conversation.findByIdAndUpdate(conversationId, {
  lastMessage: "This message was deleted",
});

    res.status(200).json({
      message: "Message deleted successfully",
      deletedMessageId: messageId,
    });
  } catch (err) {
    console.log("there is err while deleting message", err);
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  sendMessage,getMessages,editMessage,deleteMessage
}

