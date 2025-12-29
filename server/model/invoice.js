const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  client: { type: String, required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Paid", "Overdue"], default: "Pending" },
  dueDate: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Invoice", invoiceSchema);
