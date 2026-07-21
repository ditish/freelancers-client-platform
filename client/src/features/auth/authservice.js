import API from "../../utiles/axiosConfigaxios";

const signUp = async (userdata) => {
  const res = await API.post("/auth/signup", userdata);
  return res.data.user;
  
};

export const googleLoginService = async (idToken, role) => {
  const res = await API.post(
    "/auth/google",
    { idToken, role },
    { withCredentials: true } // required to receive/send the httpOnly cookie
  );
  return res.data;
};

const login = async (email,password,role) => {
  const res = await API.post("/auth/login", email, password,role)
  return res.data.user;
};

const logOut = async () => {
  const res = await API.post("/auth/logOut")
  return res.data.message;

}

const resetPassword = async ({ email, role }) => {
  const res = await API.post("/auth/resetPassword", {email, role}) 
  return res.data;
}
const verifyOtpAndResetPassword = async ({ email, role, otp, newPassword }) => {
  const res = await API.post("/auth/verifyotp", {email,role, otp, newPassword })
  return res.data
 }

export default { signUp,googleLoginService, login,logOut, resetPassword,verifyOtpAndResetPassword };

