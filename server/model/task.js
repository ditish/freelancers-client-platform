const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true,index:true },
    client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",required:true
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  deadline: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
