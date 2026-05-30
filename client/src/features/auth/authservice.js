import API from "../../utiles/axiosConfigaxios";

const signUp = async (userdata) => {
  const res = await API.post("/auth/signup", userdata);
  return res.data.user;
  
};

const login = async (email,password,role) => {
  const res = await API.post("/auth/login", email, password,role)
  return res.data.user;
};

const logOut = async () => {
  const res = await API.post("/auth/logOut")
  return res.data.message;

}


const resetPassword = async (email) => {
  const res = await API.post("/auth/resetPassword", email) 
  return res.data;
}
const verifyOtp = async (otp,newpassword) => {
  const res = await API.post("/auth/verifyotp,", otp,newpassword)
  return res.data
 }

export default { signUp, login,logOut, resetPassword,verifyOtp };

