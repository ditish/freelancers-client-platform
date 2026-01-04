const express = require("express");
const router = express.Router();
const { getInvoices, createInvoice,payInvoice } = require("../controllers/invoicecontrollers");
const { verifyToken} = require("../middleware/verifytoken");


router.get("/getInvoice", verifyToken, getInvoices);
router.post("/createInvoice", verifyToken, createInvoice);
router.put ("/pay/:id",verifyToken,payInvoice)
module.exports = router;
