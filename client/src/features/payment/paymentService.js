
import API from "../../utiles/axiosConfigaxios.js";
const initiateEsewa = async (invoiceId) => {
  const res = await API.post("/payments/esewa/initiate", { invoiceId });
  return res.data;
};

const verifyEsewa = async (data) => {
  const res = await API.post("/payments/esewa/verify", { data });
  return res.data;
};

export default { initiateEsewa, verifyEsewa };