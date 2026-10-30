import axios from "axios";

const initiateEsewa = async (invoiceId) => {
  const res = await axios.post("/api/payments/esewa/initiate", { invoiceId });
  return res.data;
};

const verifyEsewa = async (data) => {
  const res = await axios.post("/api/payments/esewa/verify", { data });
  return res.data;
};

export default { initiateEsewa, verifyEsewa };