const { getFreelancer, getFreelancerProfile, getClientProfile } = require("../controllers/clientcontrollers")
const { verifyToken } = require("../middleware/verifytoken")
const express = require("express")
const router = express.Router();
router.get('/client/freelancers',verifyToken, getFreelancer)
router.get("/client/freelancerProfile/:id", verifyToken, getFreelancerProfile)
router.get("/clientProfile/:id", verifyToken,getClientProfile)
module.exports = router;