const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  client: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Ongoing", "Completed"], default: "Pending" },
  deadline: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
