import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authslice";
import projectReducer from "../features/Project/projectSlice"
import taskReducer from "../features/task/taskslice";
import invoiceReducer from "../features/invoice/invoiceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    tasks: taskReducer,
    invoices: invoiceReducer,
  },
});

