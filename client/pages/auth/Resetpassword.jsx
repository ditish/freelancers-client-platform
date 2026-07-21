import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetLogin, verifyOtpUser } from "../../src/features/auth/authslice";
import { useNavigate, useLocation, Link } from "react-router-dom";
import AuthWrapper from "../../components/Authwrapper";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isError, isSuccess, message } = useSelector((state) => state.auth);

  const { email, role } = location.state || {};

  // If someone lands here directly without going through ForgotPassword first
  useEffect(() => {
    if (!email || !role) {
      toast.error("Please request a password reset first");
      navigate("/forgot-password");
    }
  }, [email, role, navigate]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
       dispatch(resetLogin());
    }
    if (isSuccess) {
      toast.success("Password reset successful");
       dispatch(resetLogin());
      navigate("/login");
    }
  }, [isError, isSuccess, message, navigate, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!otp || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    dispatch(verifyOtpUser({ email, role, otp, newPassword }));
  };

  return (
    <AuthWrapper title="Reset Password">
      <form onSubmit={submitHandler} className="space-y-4">
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition">
          Reset Password
        </button>
        <div className="flex justify-between text-sm text-gray-600">
          <Link to="/login" className="hover:text-indigo-500">Back to Login</Link>
        </div>
      </form>
    </AuthWrapper>
  );
};

export default ResetPassword;