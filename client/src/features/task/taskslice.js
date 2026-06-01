import { createSlice } from "@reduxjs/toolkit";
import taskService from "./taskService";

const initialState = {
  tasks: [],
  task: [],
  totalTasks: 0,
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
      state.tasks = action.payload.tasks || [],
      state.totalTasks = action.payload.totalTasks || 0,
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
       setTaskbyProject: (state, action) => {
      state.task = action.payload || []
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

export const { setLoading, setTasks, setError ,setTaskbyProject } = taskSlice.actions;

export const fetchTasks = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const tasks = await taskService.getTasks();
    console.log("this is tasks data", tasks);
    dispatch(setTasks(tasks));
  } catch (err) {
    dispatch(setError(err.response?.data?.message || "Failed to fetch tasks"));
  }
};

export const fetchTaskbyProject = ( projectId ) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
  console.log("from fetchTask",projectId )
    const task = await taskService.getTaskbyProject( projectId)

    dispatch(setTaskbyProject(task));
  } catch (err) {
    dispatch(
      setError(
        err.response?.data?.message || "Failed to fetch project details"
      )
    );
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
export const updateTask = ({ taskId, taskData }) => async (dispatch) => {
  try {
    await taskService.updateTask(taskId, taskData);
    console.log("msg form updatetaskslice", taskId, taskData);
  } catch (err) {
    dispatch(setError(err.response?.data?.message || "Failed to update task"));
  }
};
export const deleteTask = (taskId) => async (dispatch) => {
  try {
    await taskService.deleteTask(taskId);
    await dispatch(fetchTasks()); // 👈 re-fetch after delete
  } catch (err) {
    dispatch(setError(err.response?.data?.message || "Failed to delete task"));
  }
};

export const assignDirectTasks = ({ taskIds, assignedTo }) => async (dispatch) => {
  try {
    await taskService.assignDirectTasks(taskIds, assignedTo);
    console.log("thus is handleslice",taskIds,assignedTo)
    await dispatch(fetchTasks()); // 👈 re-fetch after assign
  } catch (err) {
    dispatch(setError(err.response?.data?.message || "Failed to assign tasks"));
  }
};


export default taskSlice.reducer;
