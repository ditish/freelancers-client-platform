import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  loginFailure } from "../../src/features/auth/authslice"
import { useNavigate, Link } from "react-router-dom";
import Authwrapper from "../../components/Authwrapper";
import { toast } from "react-toastify";
import { signupUser,resetSignup } from "../../src/features/auth/authslice";

const Signup = () => {
  const [company, setCompany] = useState("");   // client-specific
const [skills, setSkills] = useState("");  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError, signupSucess, message} = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      console.log(message)
      toast.error(message);
      dispatch(resetSignup());
    
    }
    if (signupSucess) {
      toast.success("Registration successful");
      navigate("/login");
      dispatch(resetSignup());
    }
  }, [isError, message, user, navigate, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
  
  const userData = {
    name,
    email,
    password,
    role,
    ...(role === "freelancer" && { skills: skills.split(",").map(s => s.trim())}),
    ...(role === "client" && { company }),
    }
    dispatch(signupUser(userData));
    
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
        <div className="flex gap-6">
  <label className="flex items-center gap-2">
    <input
      type="radio"
      name="role"
      value="freelancer"
      checked={role === "freelancer"}
      onChange={(e) => setRole(e.target.value)}
    />
    Freelancer
  </label>

  <label className="flex items-center gap-2">
    <input
      type="radio"
      name="role"
      value="client"
      checked={role === "client"}
      onChange={(e) => setRole(e.target.value)}
    />
    Client
  </label>
        </div>
        {
          role === "client" && (
              <input
    type="text"
    placeholder="Company Name"
    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
    value={company}
    onChange={(e) => setCompany(e.target.value)}
    required
  />
          )
        }
        {
          role === "freelancer" && (
               <input
      type="text"
      placeholder="Skills (comma separated)"
      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
      value={skills}
      onChange={(e) => setSkills(e.target.value)}
      required
    />
          )
        }

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
