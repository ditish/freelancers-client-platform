import { createSlice } from "@reduxjs/toolkit";
import paymentService from "./paymentService";
import { fetchInvoices } from "../invoices/invoiceSlice"; // adjust path

const initialState = {
  isPaying: false,       // initiating / redirecting to eSewa
  isVerifying: false,    // verifying on the success page
  isSuccess: false,
  isError: false,
  message: "",
};

const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    setPaying: (state, action) => {
      state.isPaying = action.payload;
      state.isError = false;
      state.message = "";
    },
    setVerifying: (state, action) => {
      state.isVerifying = action.payload;
      state.isError = false;
      state.message = "";
    },
    setPaymentSuccess: (state, action) => {
      state.isVerifying = false;
      state.isSuccess = true;
      state.message = action.payload;
    },
    setPaymentError: (state, action) => {
      state.isPaying = false;
      state.isVerifying = false;
      state.isError = true;
      state.message = action.payload;
    },
    resetPayment: () => initialState,
  },
});

export const {
  setPaying,
  setVerifying,
  setPaymentSuccess,
  setPaymentError,
  resetPayment,
} = paymentSlice.actions;

export const payWithEsewa = (invoiceId) => async (dispatch) => {
  try {
    dispatch(setPaying(true));
    const { url, fields } = await paymentService.initiateEsewa(invoiceId);

    const form = document.createElement("form");
    form.method = "POST";
    form.action = url;
    Object.entries(fields).forEach(([k, v]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = k;
      input.value = v;
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit(); // browser leaves your app here, so isPaying stays true on purpose
  } catch (err) {
    dispatch(setPaymentError(err.response?.data?.message || "Failed to start payment"));
  }
};

export const verifyEsewaPayment = (data) => async (dispatch) => {
  try {
    dispatch(setVerifying(true));
    const res = await paymentService.verifyEsewa(data);
    dispatch(setPaymentSuccess(res.message));
    dispatch(fetchInvoices()); // refresh invoice list so status shows "paid"
  } catch (err) {
    dispatch(setPaymentError(err.response?.data?.message || "Payment verification failed"));
  }
};

export default paymentSlice.reducer;