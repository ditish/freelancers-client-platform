// routes/paymentRoutes.js
const { initiateEsewa, verifyEsewa } = require("../controllers/paymentcontrollers");
const { verifyToken } = require("../middleware/verifytoken")
const express = require("express");
const router = express.Router();



router.post("/esewa/initiate", verifyToken, initiateEsewa);
router.post("/esewa/verify", verifyToken, verifyEsewa);

module.exports = router;