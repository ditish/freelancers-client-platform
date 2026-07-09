const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
   password: {
  type: String,
  required: function () { return this.authProvider !== "google"; },
},
authProvider: {
  type: String,
  enum: ["local", "google"],
  default: "local",
},
googleId: {
  type: String,
  default: null,
},
  role: {
      type: String,
      eum: ["freelancer", "client"],
      required:true
    },
    skills: [
      {
        type:String,
      }
    ],
    company: {
      type:String,
    },
    lastOpenedConversation: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Conversation",
  default: null
}
  },
  { timestamps: true } // automatic createdAt + updatedAt
);
userSchema.index({ email: 1, role: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
