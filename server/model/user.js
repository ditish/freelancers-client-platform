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
      required: true,
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
    }
  },
  { timestamps: true } // automatic createdAt + updatedAt
);
userSchema.index({ email: 1, role: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
