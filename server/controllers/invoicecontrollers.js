const Invoice = require("../model/invoice");

// Get all invoices for a user
exports.getInvoices = async (req, res) => {
  try {
    let invoices;
    if (req.role == "clinet") {
      invoices = await Invoice.find({ client: req.user._id }).populate("client", "name email")
        .populate('freelancer', "name email")
        .populate("project ", "tittle")
    }
    if (req.role == "freelancer") {
      invoices = await Invoice.find({ freelancer: req.user._id }).populate("client", "name email")
        .populate('freelancer', "name email")
        .populate("project ", "tittle")
    }

    console.log("this is invoice ", req.user._id)
    res.status(200).json({sucess:true,message:"invoice found",invoices});
  } catch (error) {
        console.error(error);
    res.status(500).json({ message: error });
  }
};


// Create a new invoice
exports.createInvoice = async (req, res) => {
  const { client, project, amount, status, dueDate } = req.body;

  try {
    const invoice = await Invoice.create({
      client,
      project,
      amount,
      status,
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
