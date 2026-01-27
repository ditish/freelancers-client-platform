const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
   invoiceNumber: { type: String, required: true, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // freelancer
  selectedClient: { type: mongoose.Schema.Types.ObjectId, ref: "User",required:true }, // client
   Project:{type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true},
  amount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Paid", "Overdue"], default: "Pending" },
  dueDate: { type: Date, required: true },
  // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Invoice", invoiceSchema);
