import { createSlice } from "@reduxjs/toolkit";
import projectService from "./projectService";

const initialState = {
  projects: [],
  project: [],
  totalProjects:0,
  isLoading: false,
  isError: false,
  message: "",
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setProjects: (state, action) => {
      state.projects = action.payload.user_project || []
      state.totalProjects = action.payload.totalProject || 0;
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
      
      setProjectById: (state, action) => {
        state.project = action.payload.project || [];
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },

    setError: (state, action) => {
      state.isError = true;
      state.isLoading = false;
      state.message = action.payload;
    },
  },
});

export const { setLoading, setProjects, setError, setProjectById} = projectSlice.actions;

export const fetchProjects = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const projects = await projectService.getProjects();
    dispatch(setProjects(projects));
  } catch (err) {
    dispatch(setError(err.response?.data?.message || "Failed to fetch projects"));
  }
};
 export const fetchProjectById = (projectId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const project = await projectService.getProjectById(projectId);

    dispatch(setProjectById(project));
  } catch (err) {
    dispatch(
      setError(
        err.response?.data?.message || "Failed to fetch project details"
      )
    );
  }
};

export const createProject = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await projectService.createProject(data);
    dispatch(fetchProjects());
  } catch (err) {
    dispatch(setError(err.response?.data?.message || "Failed to create project"));
  }
};
 export const deleteProjectbyID = (projectId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

     await projectService.deleteProject(projectId);
    return;

  } catch (err) {
    dispatch(
      setError(
        err.response?.data?.message || "Failed to delete project"
      )
    );
  }
};

export default projectSlice.reducer;
