// controllers/paymentControllers.js
const crypto = require("crypto");
const axios = require("axios");
const Invoice = require("../model/invoice");
const Payment = require("../model/payment");

const PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE;      // EPAYTEST in dev
const SECRET = process.env.ESEWA_SECRET_KEY;
const FORM_URL = process.env.ESEWA_FORM_URL;              // rc-epay... or epay...
const STATUS_URL = process.env.ESEWA_STATUS_URL;          // take from eSewa docs per environment

const sign = (message) =>
  crypto.createHmac("sha256", SECRET).update(message).digest("base64");

exports.initiateEsewa = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.body.invoiceId);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
   
  if (String(invoice.selectedClient) !== String(req.user._id))
  return res.status(403).json({ message: "Not your invoice" });
    if (invoice.status == "paid")
      return res.status(400).json({ message: "Invoice is already paid" });
     if (invoice.status == "Overdue")
      return res.status(400).json({ message: "Invoice is outofdate" });

const total = invoice.amount.toFixed(2);
    const transactionUuid = `${invoice._id}-${Date.now()}`;

    await Payment.create({
      invoice: invoice._id,
      payer: req.user._id,
      gateway: "esewa",
      transactionUuid,
      amount: invoice.amount,
    });

    const signature = sign(
      `total_amount=${total},transaction_uuid=${transactionUuid},product_code=${PRODUCT_CODE}`
    );
    console.log("CLIENT_URL:", process.env.CLIENT_URL);

    res.json({
      url: FORM_URL,
      fields: {
        amount: total,
        tax_amount: "0",
        total_amount: total,
        transaction_uuid: transactionUuid,
        product_code: PRODUCT_CODE,
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: `${process.env.CLIENT_URL}/payment/esewa/success`,
        failure_url: `${process.env.CLIENT_URL}/payment/esewa/failure`,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("there is problme while payment".err);
  }
};

exports.verifyEsewa = async (req, res) => {
  try {
    const data = JSON.parse(Buffer.from(req.body.data, "base64").toString("utf8"));

    // 1. verify signature using the fields eSewa says it signed
    const message = data.signed_field_names
      .split(",")
      .map((f) => `${f}=${data[f]}`)
      .join(",");
    if (sign(message) !== data.signature)
      return res.status(400).json({ message: "Invalid signature" });

    // 2. match against our own pending record
    const payment = await Payment.findOne({ transactionUuid: data.transaction_uuid });
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    if (String(payment.payer) !== String(req.user._id))
      return res.status(403).json({ message: "Forbidden" });
    if (Number(data.total_amount.toString().replace(/,/g, "")) !== payment.amount)
      return res.status(400).json({ message: "Amount mismatch" });

    // 3. confirm with eSewa's status API (don't trust the redirect alone)
    const { data: status } = await axios.get(STATUS_URL, {
      params: {
        product_code: PRODUCT_CODE,
        total_amount: payment.amount,
        transaction_uuid: payment.transactionUuid,
      },
    });
    if (status.status !== "COMPLETE") {
      await Payment.updateOne({ _id: payment._id }, { status: "FAILED", rawResponse: status });
      return res.status(400).json({ message: `Payment ${status.status}` });
    }

    // 4. idempotent update: only flips if still PENDING
    const updated = await Payment.findOneAndUpdate(
      { _id: payment._id, status: "PENDING" },
      { status: "COMPLETE", gatewayRef: data.transaction_code, rawResponse: status },
      { new: true }
    );
    if (updated) {
      await Invoice.findByIdAndUpdate(payment.invoice, { status: "paid", paidAt: new Date() });
      // emit notification to the freelancer here, using your getConnectedUsers() helper
    }
    res.json({ message: "Payment successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};