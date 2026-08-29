import API from "../../utiles/axiosConfigaxios";

const getTasks = async () => {
  const res = await API.get("/tasks/gettask");
  return res.data;
};
const getTaskbyProject = async(projectId,) => {
  console.log("🔥 getTaskbyProject CALLED with:", projectId);
  try {
     const res = await API.get(`/tasks/TaskbyProject/${projectId}`,   {
    withCredentials: true,
     });
    if (res.status === 401) {
      console.log("there is no task")
      return
    }

  console.log("this is our task", res.data);
  return res.data.tasks; // or res.data.tasks depending on backend
  } catch (error) {
    console.log("there is no err while geting task",error)
  }
 
};


const createTask = async (data) => {
  const res = await API.post("tasks/createtask", data);
  return res.data;
};
const updateTask = async (taskId, taskData) => {
  const res = await API.put(`/tasks/update/${taskId}`, taskData);
  return res.data;
};
const updateTaskStatus = async ( taskId, status ) => {
  console.log("this is updatetaskId status", taskId, status);
   const res = await API.patch(`/tasks/${taskId}/status`,{status});
  return res.data;
  
}
const deleteTask = async (taskId) => {
  const res = await API.delete(`/tasks/delete/${taskId}`);
  return res.data;
};

const assignDirectTasks = async (taskIds, assignedTo) => {
  const res = await API.put("/tasks/assignDirect", { taskIds, assignedTo });
  console.log("this is assign direct mssage", res.data);
  return res.data;
};
export default { getTasks, createTask, getTaskbyProject, updateTask, deleteTask, assignDirectTasks ,updateTaskStatus };
