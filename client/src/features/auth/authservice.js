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

export default { register, login, logout };

export const loginUser = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const user = await authService.login(userData);
    dispatch(loginSuccess(user));
  } catch (err) {
    dispatch(setError(err.response?.data?.message || "Login failed"));
  }
};

export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const user = await authService.register(userData);
    dispatch(loginSuccess(user));
  } catch (err) {
    dispatch(setError(err.response?.data?.message || "Registration failed"));
  }
};
