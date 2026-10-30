// models/Payment.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", required: true },
    payer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    gateway: { type: String, enum: ["esewa", "khalti", "other"], required: true },
    transactionUuid: { type: String, unique: true, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["PENDING", "COMPLETE", "FAILED"], default: "PENDING" },
    gatewayRef: String,   // eSewa's transaction_code
    rawResponse: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);