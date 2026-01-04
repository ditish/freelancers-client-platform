import { createSlice } from "@reduxjs/toolkit";
import taskService from "./taskService";

const initialState = {
  tasks: [],
  isLoading: false,
  isError: false,
  message: "",
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setTasks: (state, action) => {
      state.tasks = action.payload.tasks||[]
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

export const { setLoading, setTasks, setError } = taskSlice.actions;

export const fetchTasks = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const tasks = await taskService.getTasks();
    dispatch(setTasks(tasks));
  } catch (err) {
    dispatch(setError(err.response?.data?.message || "Failed to fetch tasks"));
  }
};

export const createTask = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await taskService.createTask(data);
    dispatch(fetchTasks());
  } catch (err) {
    dispatch(setError(err.response?.data?.message || "Failed to create task"));
  }
};

export default taskSlice.reducer;
