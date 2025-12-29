import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import projectReducer from "../features/projects/projectSlice";
import taskReducer from "../features/tasks/taskSlice";
import invoiceReducer from "../features/invoices/invoiceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    tasks: taskReducer,
    invoices: invoiceReducer,
  },
});

