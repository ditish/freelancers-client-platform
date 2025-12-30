import API from "../../utiles/axiosConfigaxios";

const signUp = async (name,email,password) => {
  const res = await API.post("/auth/signup", { name, email, password });
  if (res.data) localStorage.setItem("user", JSON.stringify(res.data));
  return res.data;
};

const login = async (email,password) => {
  const res = await API.post("/auth/login", email,password);
  if (res.data) localStorage.setItem("user", JSON.stringify(res.data));
  return res.data;
};

const logout = () => {
  localStorage.removeItem("user");
};
const resetPassword = async(email) => {
  const res = await API.post("/auth/resetPassword", email) 
  return res.data;
}
const verifyOtp = async (otp,newpassword) => {
  const res = await API.post("/auth/verifyotp,", otp,newpassword)
  return res.data
 }

export default { signUp, login, logout,resetPassword,verifyOtp };

