import { createSlice } from "@reduxjs/toolkit";
import invoiceService from "./invoiceService";

const initialState = {
  invoices: [],
  isLoading: false,
  isError: false,
  message: "",
};

const invoiceSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setInvoices: (state, action) => {
      state.invoices = action.payload.invoice || []
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
    setError: (state, action) => {
      state.isError = true;
      state.isLoading = false;
      state.message = action.payload;
    },
  },
});

export const { setLoading, setInvoices, setError } = invoiceSlice.actions;

export const fetchInvoices = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const invoices = await invoiceService.getInvoices();
    dispatch(setInvoices(invoices));
  } catch (err) {
    dispatch(setError(err.response?.data?.message || "Failed to fetch invoices"));
  }
};

export const createInvoice = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await invoiceService.createInvoice(data);
    dispatch(fetchInvoices());
  } catch (err) {
    dispatch(setError(err.response?.data?.message || "Failed to create invoice"));
  }
};

export default invoiceSlice.reducer;
