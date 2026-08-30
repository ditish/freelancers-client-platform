import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser,resetLogin ,toastDisable} from "../../src/features/auth/authslice"
import { useNavigate, Link } from "react-router-dom";
import AuthWrapper from "../../components/Authwrapper";
import { toast } from "react-toastify";
import { MdOutlineEmail, MdLockOutline } from "react-icons/md";
import { FaUserTag } from "react-icons/fa6";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError, isSuccess, message ,role:Authrole,Showtoast } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message)
      dispatch(resetLogin())
    }
    if (Showtoast) {
      toast.success("Login successful")
      dispatch(toastDisable());
    }
    if (isSuccess ) {
      Authrole === "client" ? navigate("/Client_Dashboard") : navigate("/freelance_Dashboard")    
      dispatch(toastDisable())
    }
  }, [isError, isSuccess, message, user, navigate, dispatch,Authrole]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password,role }));
  };

  return (
    <AuthWrapper title="Welcome back">
      <form onSubmit={submitHandler} className="space-y-4">
        <div className="relative">
          <MdOutlineEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg" />
          <input
            type="email"
            placeholder="Email"
            className="w-full pl-11 pr-4 py-3 rounded-lg glass-input"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="relative">
          <MdLockOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg" />
          <input
            type="password"
            placeholder="Password"
            className="w-full pl-11 pr-4 py-3 rounded-lg glass-input"
            onChange={(e) => setPassword(e.target.value)}
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
        <button className="w-full btn-primary py-3 rounded-lg font-semibold transition">
          Login
        </button>
        <div className="flex justify-between text-sm text-white/50">
          <Link to="/forgot-password" className="hover:text-white transition-colors">Forgot Password?</Link>
          <Link to="/signup" className="hover:text-white transition-colors">Create account</Link>
        </div>
      </form>
    </AuthWrapper>
  );
};

export default Login;
