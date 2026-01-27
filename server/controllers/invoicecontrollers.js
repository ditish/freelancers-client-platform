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
     console.log("these are the invoices", invoices)
    res.status(200).json({sucess:true,message:"invoice found",invoices});
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
  console.log("this is client",selectedClient)
    res.status(201).json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
  
 exports.payInvoice =  async ( req,res) => {
  try {
    const Invoiceid = await req.params.id;
     const Invoice = await Invoice.findById(Invoiceid);
    if (!Invoice) {
      return res.status(404).json({ sucess: false, message: "user not found" })
    }
    if (Invoice.client.toString() !== req.user._id.toString())
    {
         return res.status(403).json({ success: false, message: "Not authorized to pay this invoice" })
    }
      Invoice.status = "paid"
      await Invoice.save();
       res.status(200).json({ success: true, message: "Invoice paid successfully", Invoice });

    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
