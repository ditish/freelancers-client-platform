import API from "../../utiles/axiosConfigaxios";

const getProjects = async () => {
  const res = await API.get("/project/getproject");
  return res.data;
};

const createProject = async (data) => {
  const res = await API.post("/project/createproject", data);
  return res.data;
};

export default { getProjects, createProject };
