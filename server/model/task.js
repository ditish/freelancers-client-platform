const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["Pending", "Ongoing", "Completed"], default: "Pending" },
  deadline: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
