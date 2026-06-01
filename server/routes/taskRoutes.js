const express = require("express");
const router = express.Router();
const { getTasks, createTask ,getTaskbyProject, updateTask, deleteTask, assignDirectTasks} = require("../controllers/Taskcontrollers.js");
const { verifyToken} = require("../middleware/verifytoken");


router.get("/gettask", verifyToken, getTasks)
router.put("/update/:taskId", verifyToken, updateTask);
router.get("/TaskbyProject/:projectId",verifyToken,getTaskbyProject)
router.post("/createtask", verifyToken, createTask);
router.delete("/delete/:taskId", verifyToken, deleteTask);
router.put("/assignDirect", verifyToken, assignDirectTasks);

module.exports = router;
