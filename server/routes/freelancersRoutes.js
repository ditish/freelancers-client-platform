const { getMyClients } = require("../controllers/freelancersControllers")
const { verifyToken } = require("../middleware/verifytoken")
const express = require("express")
const router = express.Router();
router.get("/my-clients", verifyToken, getMyClients);
module.exports = router;