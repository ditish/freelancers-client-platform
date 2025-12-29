const express = require("express");
const router = express.Router();
const { getTasks, createTask } = require("../controllers/Taskcontrollers.js");
const { verifyToken} = require("../middleware/verifytoken");


router.get("/gettask",verifyToken, getTasks)
router.post("/createtask",verifyToken, createTask);

module.exports = router;
