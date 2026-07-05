const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;
const mongoose = require("mongoose");
const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    lastMessage: { type: String, default: "" },
    deletedBy: [
      {
        user: { type: ObjectId, ref: "User" },

        deletedAt: { type: Date, default: Date.now }
      }],
    
     lastRead: [{
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: Date
}],
    
  },
   
  { timestamps: true }
);
module.exports = mongoose.model("Conversation", conversationSchema);