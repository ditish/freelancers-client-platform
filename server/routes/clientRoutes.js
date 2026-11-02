const { getFreelancer,  getClients, getMyFreelancers } = require("../controllers/clientcontrollers")
const { verifyToken } = require("../middleware/verifytoken")
const express = require("express")
const router = express.Router();
router.get('/client/freelancers',verifyToken, getFreelancer)
router.get("/clients", verifyToken, getClients)
router.get("/my-freelancers", verifyToken, getMyFreelancers);
module.exports = router;