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
     

  },
  { timestamps: true }
);
module.exports = mongoose.model("Message", messageSchema);