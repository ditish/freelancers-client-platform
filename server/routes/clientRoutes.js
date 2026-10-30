const { getFreelancer,  getClients } = require("../controllers/clientcontrollers")
const { verifyToken } = require("../middleware/verifytoken")
const express = require("express")
const router = express.Router();
router.get('/client/freelancers',verifyToken, getFreelancer)
router.get("/clients", verifyToken,getClients)
module.exports = router;