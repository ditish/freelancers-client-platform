import { createSlice } from "@reduxjs/toolkit";
import projectService from "./projectService";

const initialState = {
  projects: [],
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
      state.projects = action.payload;
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

export const { setLoading, setProjects, setError } = projectSlice.actions;

export const fetchProjects = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const projects = await projectService.getProjects();
    dispatch(setProjects(projects));
  } catch (err) {
    dispatch(setError(err.response?.data?.message || "Failed to fetch projects"));
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

export default projectSlice.reducer;
