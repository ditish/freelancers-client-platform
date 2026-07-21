import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserforgetPassword, resetLogin } from "../../src/features/auth/authslice";
import { useNavigate, Link } from "react-router-dom";
import AuthWrapper from "../../components/Authwrapper";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, isSuccess, message,isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(resetLogin());
    }
    if (isSuccess) {
      toast.success("OTP sent to your email");
      dispatch(resetLogin());
      navigate("/reset-password", { state: { email, role } });
    }
  }, [isError, isSuccess, message, navigate, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!email || !role) {
      toast.error("Email and role are required");
      return;
    }
    dispatch(UserforgetPassword({ email, role }));
  };

  return (
    <AuthWrapper title="Forgot Password">
      <form onSubmit={submitHandler} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
          required
        >
          <option value="" disabled>Select Role</option>
          <option value="client">Client</option>
          <option value="freelancer">Freelancer</option>
        </select>
          <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              Sending...
            </>
          ) : (
            "Send OTP"
          )}
        </button>
        <div className="flex justify-between text-sm text-gray-600">
          <Link to="/login" className="hover:text-indigo-500">Back to Login</Link>
        </div>
      </form>
    </AuthWrapper>
  );
};

export default ForgotPassword;