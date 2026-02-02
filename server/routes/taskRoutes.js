const express = require("express");
const router = express.Router();
const { getTasks, createTask ,getTaskbyProject} = require("../controllers/Taskcontrollers.js");
const { verifyToken} = require("../middleware/verifytoken");


router.get("/gettask", verifyToken, getTasks)
router.get("/TaskbyProject/:projectId",verifyToken,getTaskbyProject)
router.post("/createtask",verifyToken, createTask);

module.exports = router;
