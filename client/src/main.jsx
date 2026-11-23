
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import { store } from "./app/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import './index.css';
import App from './App';

// Restore the saved theme before React renders.
// Dark mode is the default for first-time visitors.
const savedTheme = localStorage.getItem("freelancer-theme") || "dark";

document.documentElement.dataset.theme = savedTheme;
document.documentElement.style.colorScheme = savedTheme;

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
);
