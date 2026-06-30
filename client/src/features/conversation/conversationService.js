import API from "../../utiles/axiosConfigaxios";
// GET conversations
const getConversation = async () => {
  const res = await API.get("/conversations/getConversations");
  return res.data;
};

// CREATE conversation
const createConversation = async (receiverId) => {
  const res = await API.post("/conversations/create", {
    receiverId
  },);
  return res.data;
};

// DELETE conversation
const deleteConversation = async (conversationId) => {
  console.log("this is conversationdelte service");
  const res = await API.delete(
    `/conversations/${conversationId}`
  );
  console.log("this is res", res);
  return res.data;
};

const updateLastConversation = async (conversationId) => {
  const response = await API.patch('/conversations/upadateLast-conversation', { conversationId });
  return response.data;
};

const conversationService = {
  getConversation,
  createConversation,
  deleteConversation,
  updateLastConversation,
};

export default conversationService;