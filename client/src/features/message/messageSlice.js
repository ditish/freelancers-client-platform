import { createSlice } from "@reduxjs/toolkit";
import messageService from "./messageService";
import { updateLastmessage } from "../conversation/convesationSlice";

const initialState = {
  messages: [],
  isLoading: false,
  isError: false,
  message: "",
};

const messageSlice = createSlice({
  name: "messages",
  initialState,

  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setMessages: (state, action) => {
      state.messages = action.payload.messages || [];
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },

    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    updateMessage: (state, action) => {
      const updated = action.payload;
      console.log("updating message", updated);
      state.messages = state.messages.map((msg) =>
        msg._id === updated._id ? updated : msg
      );
    },
    updateDeleteMessage: (state, action) => {
      console.log("payload received:", action.payload);
  const messageId = action.payload;
  const msg = state.messages.find(m => m._id === messageId);
  if (msg) {
    msg.isDeleted = true;
  }
},

    clearMessages: (state) => {
      state.messages = [];
    },

    setError: (state, action) => {
      state.isError = true;
      state.isLoading = false;
      state.message = action.payload;
    },
  },
});

export const {
  setLoading,
  setMessages,
  addMessage,
  updateMessage,
  updateDeleteMessage,
  clearMessages,
  setError,
} = messageSlice.actions;

export const fetchMessages =
  (conversationId) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
  console.log("calling getMessages with", conversationId); // ← add this
      const messages =
        await messageService.getMessage(
          conversationId
        );
console.log("this is fetchmessage in slice",messages)
      dispatch(setMessages(messages));
    } catch (err) {
          console.log("FULL ERROR", err);
      dispatch(
        setError(
          err.response?.data?.message ||
            "Failed to fetch messages"
        )
      );
    }
  };

  export const sendMessage =
    ({ conversationId, text, replyTo }) => async (dispatch) => {

    try {
      dispatch(setLoading(true));
console.log("this is message", conversationId, text, replyTo )
      const newMessage =
        await messageService.sendMessage(
          {conversationId, text, replyTo}
        );
       dispatch(addMessage(newMessage));
      dispatch(updateLastmessage({ 
        conversationId, text
      }));
      dispatch(setLoading(false));
      return newMessage;
    } catch (err) {
      console.log("thus is full err", err);
      dispatch(
        setError(
          err.response?.data?.message ||
            "Failed to send message"
        )
      );
    }
  };

export const editMessage =
  ({ messageId, text,conversationId }) =>
  
    async (dispatch) => {
      console.log("thus is text", text);
      console.log("this is conversation id in edit", conversationId);
    try {
      const updated =
        await messageService.editMessage({
          messageId,
          text,
          conversationId
        });

      dispatch(updateMessage(updated));
       dispatch(updateLastmessage({ conversationId,text }));
    } catch (err) {
      console.log("there is err while editing",err)
      dispatch(
        setError(
          err.response?.data?.message ||
            "Failed to update message"
        )
      );
    }
    };
  
    export const deleteMessage =
  (messageId,conversationId) => async (dispatch) => {
    try {
      console.log("thus is delted conversation id", conversationId);
      const deletedMessage = await messageService.deleteMessage({
        messageId, conversationId}
      );
      console.log("delted message are", deletedMessage.
deletedMessageId
);

      dispatch(updateDeleteMessage(deletedMessage.
        deletedMessageId
      ));
         dispatch(updateLastmessage({ 
      conversationId, 
      text: "This message was deleted" 
    }));
    } catch (err) {
      dispatch(
        setError(
          err.response?.data?.message ||
            "Failed to delete message"
        )
      );
    }
  };
  export default  messageSlice.reducer;