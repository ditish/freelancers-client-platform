import { createSlice } from "@reduxjs/toolkit";
import authService from "./authservice";


// const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: null,
  isLoading: false,
  isError: false,
  signupSucess:false,
  isSuccess: false,
  message: "",
  role: "",
  isloadingUser: true,
  Showtoast: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.role = action.payload.role
      state.isloadingUser = false
      state.isSuccess = true;
    },
    loginStart: (state) => {
      state.isLoading = true;
      state.isError = false;
      state.message = "";
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload;
      state.role = action.payload.role;
      state.Showtoast = true;
    },
    resetLogin: (state) => {
      
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
      state.Showtoast = false;
      state.user = null;
      state.isloadingUser = false,
        state.role = "";
      },

    toastDisable: (state) => {
    state.Showtoast = false
  },
    signUpSucess:(state, action)=> {
      state.isLoading = false
      state.signupSucess= true
      state.user = action.payload
      state.role = action.payload.role

    },
      resetSignup: (state,action) => {
    state.signupSucess = false;
    state.isError = false;
        state.message = action.payload;
        
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
    
  },
});

export const {
  setUser,
  loginStart,
  loginSuccess,
  loginFailure,
  signUpSucess,
  resetLogin,
  resetSignup,
  otpSuccess,
  toastDisable
} = authSlice.actions

export default authSlice.reducer;

// ================= THUNKS =================

export const loginUser = (email, password,role) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const user = await authService.login(email, password,role);
    dispatch(loginSuccess(user));
  } catch (err) {
     let message = "Login failed"; // default
    if (err.response && err.response.data && err.response.data.message) {
      message = err.response.data.message; // backend message
    }
    dispatch(loginFailure(message));
  }
};
export const logOutuser = () => async(dispatch)=> {
  try {
    const logOutuser = await authService.logOut();
    dispatch(resetLogin(logOutuser))
  } catch (error) {
    
  }
}

export const signupUser = (userdata) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const user = await authService.signUp(userdata);
    
    dispatch(signUpSucess(user));
  } catch (err) {
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
