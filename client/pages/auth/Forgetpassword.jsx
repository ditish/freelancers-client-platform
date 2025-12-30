import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {UserforgetPassword}  from "../../src/features/auth/authslice"
import AuthWrapper from "../../components/Authwrapper";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
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
    dispatch(UserforgetPassword(email));
  };

  return (
    <AuthWrapper title="Forgot Password">
      <form onSubmit={submitHandler} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition">
          Send OTP
        </button>
      </form>
    </AuthWrapper>
  );
};

export default ForgotPassword;
