
import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux";
import { store } from "./app/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import './index.css'
import App from './App'


createRoot(document.getElementById('root')).render(
 
    <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <App />
         </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
 
)