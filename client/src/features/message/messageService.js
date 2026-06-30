import API from "../../utiles/axiosConfigaxios";
// SEND MESSAGE
const sendMessage = async ({ conversationId, text, replyTo }) => {
  const res = await API.post("/messages/sendMessage", { conversationId, text, replyTo });
  return res.data;
};

// GET MESSAGES (by conversationId)
const getMessage = async (conversationId) => {
  const res = await API.get(`/messages/${conversationId}`);
  console.log("raw response from getmessage:", res.data); // ← add this
  return res.data;
};

// EDIT MESSAGE
const editMessage = async ({ messageId, text ,conversationId }) => {
  const res = await API.patch(
    `/messages/${messageId}`,
    {text,conversationId}
  );
  console.log("thus is data come from edit ", res.data);
  return res.data;
};



// DELETE MESSAGE
const deleteMessage = async ({ messageId, conversationId }) => {
  const res = await API.delete(`/messages/${messageId}`, { 
    data: { conversationId } 
  });
  return res.data;
};

const messageService = {
  sendMessage,
  getMessage,
  editMessage,
  deleteMessage,
};

export default messageService;