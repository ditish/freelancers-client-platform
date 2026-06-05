import API from "../../utiles/axiosConfigaxios";
// GET conversations
const getConversation = async () => {
  const res = await API.get("/getConversation");
  return res.data;
};

// CREATE conversation
const createConversation = async (data) => {
  const res = await API.patch("/createConversation", data);
  return res.data;
};

// DELETE conversation
const deleteConversation = async (conversationId) => {
  const res = await API.delete(
    `/deleteconversation/${conversationId}`
  );
  return res.data;
};

const conversationService = {
  getConversation,
  createConversation,
  deleteConversation,
};

export default conversationService;