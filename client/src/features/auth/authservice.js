import API from "../../utils/axiosConfig";

const register = async (userData) => {
  const res = await API.post("/auth/register", userData);
  if (res.data) localStorage.setItem("user", JSON.stringify(res.data));
  return res.data;
};

const login = async (userData) => {
  const res = await API.post("/auth/login", userData);
  if (res.data) localStorage.setItem("user", JSON.stringify(res.data));
  return res.data;
};

const logout = () => {
  localStorage.removeItem("user");
};
const resetPassword = async(userData) => {
  const res = await API.post("/auth/resetPassword", userData) 
  return res.data;
}

export default { register, login, logout,resetPassword };

