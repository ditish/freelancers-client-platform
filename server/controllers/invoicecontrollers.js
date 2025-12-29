const Invoice = require("../model/invoice");

// Get all invoices for a user
exports.getInvoices = async (req, res) => {
  const invoices = await Invoice.find({ createdBy: req.user._id }).populate("project", "name");
  res.json(invoices);
};

// Create a new invoice
exports.createInvoice = async (req, res) => {
  const { client, project, amount, status, dueDate } = req.body;

  const invoice = await Invoice.create({
    client,
    project,
    amount,
    status,
    dueDate,
    createdBy: req.user._id,
  });

  res.status(201).json(invoice);
};
