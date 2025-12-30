import { createSlice } from "@reduxjs/toolkit";
import authService from "./authservice";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user || null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
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
    otpSuccess: (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.message = action.payload;
    },
    logout: (state) => {
      authService.logout();
      state.user = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  otpSuccess
} = authSlice.actions

export default authSlice.reducer;

// ================= THUNKS =================

export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const user = await authService.login(email, password);
    dispatch(loginSuccess(user));
  } catch (err) {
     let message = "Login failed"; // default
    if (err.response && err.response.data && err.response.data.message) {
      message = err.response.data.message; // backend message
    }
    dispatch(loginFailure(message));
  }
};

export const signupUser = (name, email, password) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const user = await authService.signUp(name, email, password);
    dispatch(loginSuccess(user));
  } catch (err) {
  
    console.log("this is err",err);
    dispatch(loginFailure(err.response?.data?.message || "Registration failed"));
  }
};

export const UserforgetPassword = (email) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const res = await authService.resetPassword(email);
    dispatch(otpSuccess(res.message));
  } catch (err) {
    dispatch(loginFailure(err.response?.data?.message || "OTP failed"));
  }
};

export const verifyOtpUser = (otp, newpassword) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const res = await authService.verifyOtp(otp, newpassword);
    dispatch(otpSuccess(res.message));
  } catch (err) {
    dispatch(loginFailure(err.response?.data?.message || "OTP invalid"));
  }
};
