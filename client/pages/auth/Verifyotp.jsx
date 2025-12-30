
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { verifyOtpUser } from "../../src/features/auth/authslice";
import AuthWrapper from "../../components/Authwrapper";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const dispatch = useDispatch();
  const { isSuccess, isError, message } = useSelector((state) => state.auth);
const navigate = useNavigate();

useEffect(() => {
  if (isSuccess) {
    toast.success(message);
    navigate("/login");
  }

  if (isError) {
    toast.error(message);
  }
}, [isSuccess, isError, message, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(verifyOtpUser({ otp, newPassword }));
  };

  return (
    <AuthWrapper title="Verify OTP & Set New Password">
      <form onSubmit={submitHandler} className="space-y-4">

        {/* OTP */}
        <input
          type="text"
          placeholder="Enter OTP"
          maxLength={6}
          className="w-full text-center tracking-widest text-lg px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        {/* New Password */}
        <input
          type="password"
          placeholder="New Password"
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition">
          Verify & Reset Password
        </button>
      </form>
    </AuthWrapper>
  );
};

export default VerifyOtp;
