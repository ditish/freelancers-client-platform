import API from "../../utiles/axiosConfigaxios";

const getProjects = async () => {
  const res = await API.get("/project/getproject");
    console.log("this totaltask",res.data)
  return res.data;

};
const getProjectById = async (projectId) => {
  const res = await API.get(`/project/${projectId}`, {
    withCredentials: true,
  });
  return res.data;
};


const createProject = async (data) => {
  const res = await API.post("/project/createproject", data);
  return res.data;
};
const deleteProject = async (projectId) => {
  console.log("this is project id ", projectId);
   await API.delete(`/project/deleteBYid/${projectId}`);
  return res.data;
}

export default { getProjects, createProject , getProjectById , deleteProject};
