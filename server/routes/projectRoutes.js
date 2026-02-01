const express = require("express");
const router = express.Router();

const {
  getproject,
  create_user_project,
   getProjectbyId 
} = require("../controllers/Projectcontrollers");

const {verifyToken} = require("../middleware/verifytoken");

router.get("/getproject", verifyToken, getproject);
router.get("/:projectId",  getProjectbyId )
router.post("/createproject", verifyToken,  create_user_project);

module.exports = router;