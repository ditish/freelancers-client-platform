const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation"
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    text: String,

    isRead: {
      type: Boolean,
      default: false
    },
     isEdited: {
      type: Boolean,
      default: false
    },
         isDeleted: {
      type: Boolean,
      default: false
    },
          replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",   //  references another message
    default: null,
  },
     

  },
  { timestamps: true }
);
module.exports = mongoose.model("Message", messageSchema);