import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/Forgetpassword";
import VerifyOtp from "../pages/auth/Verifyotp";
import Dashboard from "../components/Dashboard";
import PrivateRoute from "../routes/Privateroutes";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
    <BrowserRouter>
        <Routes>
         <Route path="/" element={<Dashboard />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route element={<PrivateRoute />}>
        </Route>
      </Routes>
    </BrowserRouter></>
  );
}

export default App;
