const express = require("express");
const router = express.Router();
const { getTasks, createTask ,getTaskbyProject, updateTask, deleteTask, assignDirectTasks,updateTaskStatus } = require("../controllers/Taskcontrollers.js");
const { verifyToken} = require("../middleware/verifytoken");


router.get("/gettask", verifyToken, getTasks)
router.put("/update/:taskId", verifyToken, updateTask);
router.get("/TaskbyProject/:projectId",verifyToken,getTaskbyProject)
router.post("/createtask", verifyToken, createTask);
router.delete("/delete/:taskId", verifyToken, deleteTask);
router.put("/assignDirect", verifyToken, assignDirectTasks);
router.patch('/:id/status', verifyToken, updateTaskStatus);



module.exports = router;
