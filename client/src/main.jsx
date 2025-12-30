
import { createRoot } from 'react-dom/client'
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import React from "react";
import './index.css'
import App from './App'


createRoot(document.getElementById('root')).render(
 
    <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
 
)