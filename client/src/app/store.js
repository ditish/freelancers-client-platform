import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authslice";
import projectReducer from "../features/Project/projectSlice"
import taskReducer from "../features/task/taskslice";
import invoiceReducer from "../features/invoice/invoiceSlice";
import conversationReducer from "../features/conversation/convesationSlice"
import messageReducer from "../features/message/messageSlice"
 import searchReducer from "../features/search/serachSlice"
import profileReducer from "../features/profile/profileSlice"
import paymentReducer from "../features/payment/paymentSlice.js";




export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    tasks: taskReducer,
    invoices: invoiceReducer,
    conversations: conversationReducer,
    messages: messageReducer,
    search: searchReducer,
    profile: profileReducer,
    payment:paymentReducer
    
    
  },
});

