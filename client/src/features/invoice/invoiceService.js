import API from "../../utiles/axiosConfigaxios.js";

const getInvoices = async () => {
  const res = await API.get("/invoices");
  return res.data;
};

const createInvoice = async (data) => {
  const res = await API.post("/invoices", data);
  return res.data;
};

export default { getInvoices, createInvoice };
