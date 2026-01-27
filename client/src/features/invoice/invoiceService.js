import API from "../../utiles/axiosConfigaxios.js";

const getInvoices = async () => {
  const res = await API.get("/invoices/getInvoice");
  return res.data.invoices;
}

const createInvoice = async (data) => {
  const res = await API.post("/invoices/createInvoice", data);
  return res.data;
}
export default { getInvoices, createInvoice }
