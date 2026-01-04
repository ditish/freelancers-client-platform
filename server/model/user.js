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
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      eum: ["freelancer", "client"],
      required:true
    }
  },
  { timestamps: true } // automatic createdAt + updatedAt
);

module.exports = mongoose.model("User", userSchema);
