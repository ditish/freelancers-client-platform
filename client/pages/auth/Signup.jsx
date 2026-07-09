import React from "react";
import { useState, useEffect } from "react";
import { FaRegEye,FaRegEyeSlash } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { googleLoginThunk, loginFailure } from "../../src/features/auth/authslice"
import { useNavigate, Link } from "react-router-dom";
import Authwrapper from "../../components/Authwrapper";
import { toast } from "react-toastify";
import { signupUser, resetSignup } from "../../src/features/auth/authslice";
import { GoogleLogin } from "@react-oauth/google";

const ALL_SKILLS = [
  "JavaScript", "React", "Node.js", "Python", "Django", "Flask",
  "TypeScript", "Vue.js", "Angular", "MongoDB", "PostgreSQL", "MySQL",
  "GraphQL", "REST API", "Docker", "AWS", "Firebase", "Tailwind CSS",
  "CSS", "HTML", "PHP", "Laravel", "Ruby", "Rails", "Swift", "Kotlin",
  "Flutter", "React Native", "Git", "Linux", "Figma", "UI/UX Design",
  "WordPress", "SEO", "Content Writing", "Data Analysis", "Machine Learning"
];

const Signup = () => {
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, SetshowPassword] = useState(false)
  const [role, setRole] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError, signupSucess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      console.log(message);
      toast.error(message);
      dispatch(resetSignup());
    }
    if (signupSucess) {
      toast.success("Registration successful");
      navigate("/login");
      dispatch(resetSignup());
    }
  }, [isError, message, user, navigate, dispatch]);

  const handleSkillInput = (e) => {
    const value = e.target.value;
    setSkillInput(value);
    if (value.trim()) {
      const filtered = ALL_SKILLS.filter(
        (s) =>
          s.toLowerCase().includes(value.toLowerCase()) &&
          !skills.includes(s)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const addSkill = (skill) => {
    setSkills([...skills, skill]);
    setSkillInput("");
    setSuggestions([]);
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      password,
      role,
      ...(role === "freelancer" && { skills }),
      ...(role === "client" && { company }),
    };
    dispatch(signupUser(userData));
  };

   const handleGoogleSuccess = async (credentialResponse) => {
    if (!role) {
      toast.error("Please select Freelancer or Client first");
      return;
    }
    const result = await dispatch(googleLoginThunk(credentialResponse.credential, role));
    if (result?.success) {
      toast.success("Registration successful");
      navigate(role === "client" ? "/Client_Dashboard" : "/freelance_Dashboard");
    } else {
      toast.error(result?.message || "Google signup failed");
    }
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
        <div className="relative">
        <input
          
          type={showPassword?"text":"password"}
          placeholder="Password"
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
         <button
    type="button"
    onClick={() => SetshowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
  >
    {showPassword ? <FaRegEye size={18}/> : <FaRegEyeSlash size={18} />}
          </button>
          </div>
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

        {role === "client" && (
          <input
            type="text"
            placeholder="Company Name"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        )}

        {role === "freelancer" && (
          <div className="relative">
            {/* Selected skill tags */}
            <div className="flex flex-wrap gap-2 mb-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-purple-500 hover:text-purple-900 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Input */}
            <input
              type="text"
              placeholder="your skill"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={skillInput}
              onChange={handleSkillInput}
            />

            {/* Dropdown suggestions */}
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                {suggestions.map((skill) => (
                  <li
                    key={skill}
                    onClick={() => addSkill(skill)}
                    className="px-4 py-2 cursor-pointer hover:bg-purple-50 hover:text-purple-700 text-sm"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition"
        >
          signup
        </button>
   
          <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

            {role ? (
          <div className="flex justify-center">
            <GoogleLogin
              text="continue_with"
              size="medium"
              shape="rectangular"
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google signup failed")}
            />
          </div>
        ) : (
          <p className="text-sm text-center text-gray-400">
            Select Freelancer or Client above to continue with Google
          </p>
        )}


        <div className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="hover:text-purple-500">Login</Link>
        </div>
      </form>
    </Authwrapper>
  );
};

export default Signup;
