const Invoice = require("../model/invoice");

// Get all invoices for a user
exports.getInvoices = async (req, res) => {
  try {
    let invoices;
    console.log("this  is user role",req.user.role)
    if (req.user.role == "client") {
      invoices = await Invoice.find({ selectedClient: req.user._id })
        .populate("selectedClient","name")
        .populate('createdBy', "name email")
        .populate("Project", "title")
    }
    if (req.user.role == "freelancer") {
      invoices = await Invoice.find({ createdBy: req.user._id }).populate("Project", "title client")
        .populate("selectedClient","name")
        .populate('createdBy', "name email")
    }
    const Totalinvoices = invoices.length;
    
    const totalPendingAmount = invoices
  .filter(inv => inv.status === "Pending")
  .reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaidAmount = invoices
  .filter(inv => inv.status === "Paid")
  .reduce((sum, inv) => sum + inv.amount, 0);
     
    res.status(200).json({sucess:true,message:"invoice found",invoices,Totalinvoices,totalPendingAmount,totalPaidAmount});
  } catch (error) {
        console.error(error);
    res.status(500).json({ message: error });
  }
};


// Create a new invoice
exports.createInvoice = async (req, res) => {
  const { invoiceNumber,selectedClient, Project, amount, dueDate } = req.body;

  try {
    const invoice = await Invoice.create({
      invoiceNumber,
      selectedClient,
      Project,
      amount,
      dueDate,
      createdBy: req.user._id,
    });
    res.status(201).json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
  
 exports.payInvoice =  async ( req,res) => {
  try {
    const Invoiceid = await req.params.id;
     const invoice = await Invoice.findById(Invoiceid);
    if (!invoice) {
      return res.status(404).json({ sucess: false, message: "user not found" })
    }
    if (invoice.selectedClient.toString() !== req.user._id.toString())
    {
         return res.status(403).json({ success: false, message: "Not authorized to pay this invoice" })
    }
      invoice.status = "Paid"
      await invoice.save();
       res.status(200).json({ success: true, message: "Invoice paid successfully", invoice });

    
  } catch (error) {
    console.log("this is invoice err", error)
    res.status(500).json({ success: false, message: error.message });
  }
}
