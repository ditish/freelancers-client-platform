import API from "../../utiles/axiosConfigaxios";

const getTasks = async () => {
  const res = await API.get("/tasks/gettask");
  return res.data;
};

const createTask = async (data) => {
  const res = await API.post("tasks//createtask", data);
  return res.data;
};

export default { getTasks, createTask };
