import API from "../../utiles/axiosConfigaxios";

const getTasks = async () => {
  const res = await API.get("/tasks");
  return res.data;
};

const createTask = async (data) => {
  const res = await API.post("/tasks", data);
  return res.data;
};

export default { getTasks, createTask };
