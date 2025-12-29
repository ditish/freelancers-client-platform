const express = require("express");
const router = express.Router();
const { getInvoices, createInvoice } = require("../controllers/invoicecontrollers");
const { verifyToken} = require("../middleware/verifytoken");


router.get("/getinvoice",verifyToken, getInvoices)
router.post("/createInvoice",verifyToken, createInvoice);
module.exports = router;
