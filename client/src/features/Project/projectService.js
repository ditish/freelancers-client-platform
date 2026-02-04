import API from "../../utiles/axiosConfigaxios";

const getProjects = async () => {
  const res = await API.get("/project/getproject");
  return res.data;
};
const getProjectById = async (projectId) => {
  const res = await API.get(`/project/${projectId}`, {
    withCredentials: true,
  });
  return res.data.project;
};


const createProject = async (data) => {
  const res = await API.post("/project/createproject", data);
  return res.data;
};
const deleteProject = async (projectId) => {
   await API.delete(`/project/deleteBYid/${projectId}`);
  return;
}

export default { getProjects, createProject , getProjectById , deleteProject};
