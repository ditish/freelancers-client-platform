const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({

  amount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Paid", "Overdue"], default: "Pending" },
  dueDate: { type: Date, required: true },
  // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Invoice", invoiceSchema);
