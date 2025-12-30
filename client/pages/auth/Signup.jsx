import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  loginFailure } from "../../src/features/auth/authslice"
import { useNavigate, Link } from "react-router-dom";
import Authwrapper from "../../components/Authwrapper";
import { toast } from "react-toastify";
import { signupUser } from "../../src/features/auth/authslice";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      console.log(message)
      toast.error(message);
    
    }
    if (isSuccess || user) {
      toast.success("Registration successful");
      navigate("/");
    }
  }, [isError, isSuccess, message, user, navigate, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(signupUser( name, email, password ));
  };

  return (
    <Authwrapper title="signup">
      <form onSubmit={submitHandler} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition">
          signup
        </button>
        <div className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="hover:text-purple-500">Login</Link>
        </div>
      </form>
    </Authwrapper>
  );
};

export default Signup;
