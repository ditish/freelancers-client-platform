import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser,resetLogin ,toastDisable} from "../../src/features/auth/authslice"
import { useNavigate, Link } from "react-router-dom";
import AuthWrapper from "../../components/Authwrapper";
import { toast } from "react-toastify";

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
    <AuthWrapper title="Login">
      <form onSubmit={submitHandler} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setPassword(e.target.value)}
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
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition">
          Login
        </button>
        <div className="flex justify-between text-sm text-gray-600">
          <Link to="/forgot-password" className="hover:text-indigo-500">Forgot Password?</Link>
          <Link to="/signup" className="hover:text-indigo-500">signup</Link>
        </div>
      </form>
    </AuthWrapper>
  );
};

export default Login;
