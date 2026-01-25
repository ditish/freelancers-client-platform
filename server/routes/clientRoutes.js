const { getFreelancer, getFreelancerProfile } = require("../controllers/clientcontrollers")
const { verifyToken } = require("../middleware/verifytoken")
const express = require("express")
const router = express.Router();
router.get('/client/freelancers',verifyToken, getFreelancer)
router.get("/client/freelancerProfile/:id", getFreelancerProfile)
module.exports = router;