import API from "../../utiles/axiosConfigaxios";

// SEND MESSAGE
const sendMessage = async (data) => {
  const res = await API.post("/messages", data);
  return res.data;
};

// GET MESSAGES (by conversationId)
const getMessage = async (conversationId) => {
  const res = await API.get(`/messages/${conversationId}`);
  return res.data;
};

// EDIT MESSAGE
const editMessage = async ({ messageId, data }) => {
  const res = await API.patch(
    `/messages/${messageId}`,
    data
  );
  return res.data;
};

// DELETE MESSAGE
const deleteMessage = async (messageId) => {
  const res = await API.delete(
    `/messages/${messageId}`
  );
  return res.data;
};

const messageService = {
  sendMessage,
  getMessage,
  editMessage,
  deleteMessage,
};

export default messageService;