import API from "../../utils/axiosConfig";

const getProjects = async () => {
  const res = await API.get("/projects");
  return res.data;
};

const createProject = async (data) => {
  const res = await API.post("/projects", data);
  return res.data;
};

export default { getProjects, createProject };
