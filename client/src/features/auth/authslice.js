import { createSlice } from "@reduxjs/toolkit";
import authService from "./authservice";
import { resetPassword } from "../../../../server/controllers/authControllers";

// Get user from localStorage
const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user || null,
  isLoading: false,
  isError: false,
  message: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Manual login flow
    loginStart: (state) => {
      state.isLoading = true;
      state.isError = false;
      state.message = "";
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    },
    logout: (state) => {
      authService.logout(); // removes user from localStorage
      state.user = null;
      state.isError = false;
      state.message = "";
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;


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
// export const forgetPassword = (userdata) => async (dispatch) => {
//   try {
//     dispatch(setLoading(true));
//     const user = await authService.resetPassword(userdata)
//     dispatch(loginSuccess(user))
//   } catch ({error}) {
//     dispatch(setError(err.response?.data?.message || "resetPassword fail"))
//   }
// }
export default authSlice.reducer;
