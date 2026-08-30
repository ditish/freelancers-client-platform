import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserforgetPassword, resetLogin } from "../../src/features/auth/authslice";
import { useNavigate, Link } from "react-router-dom";
import AuthWrapper from "../../components/Authwrapper";
import { toast } from "react-toastify";
import { MdOutlineEmail } from "react-icons/md";
import { FaUserTag } from "react-icons/fa6";

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
        <div className="relative">
          <MdOutlineEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            className="w-full pl-11 pr-4 py-3 rounded-lg glass-input"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="relative">
          <FaUserTag className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-base" />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-lg glass-input appearance-none [&>option]:text-black"
            required
          >
            <option value="" disabled>Select Role</option>
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </select>
        </div>
          <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              Sending...
            </>
          ) : (
            "Send OTP"
          )}
        </button>
        <div className="flex justify-between text-sm text-white/50">
          <Link to="/login" className="hover:text-white transition-colors">Back to Login</Link>
        </div>
      </form>
    </AuthWrapper>
  );
};

export default ForgotPassword;
