import { createSlice } from "@reduxjs/toolkit";
import messageService from "./messageService";

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

      state.messages = state.messages.map((msg) =>
        msg._id === updated._id ? updated : msg
      );
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
  clearMessages,
  setError,
} = messageSlice.actions;

export const fetchMessages =
  (conversationId) => async (dispatch) => {
    try {
      dispatch(setLoading(true));

      const messages =
        await messageService.getMessages(
          conversationId
        );

      dispatch(setMessages(messages));
    } catch (err) {
      dispatch(
        setError(
          err.response?.data?.message ||
            "Failed to fetch messages"
        )
      );
    }
  };

  export const sendMessage =
  (messageData) => async (dispatch) => {
    try {
      dispatch(setLoading(true));

      const newMessage =
        await messageService.sendMessage(
          messageData
        );

      dispatch(addMessage(newMessage));

      dispatch(setLoading(false));
    } catch (err) {
      dispatch(
        setError(
          err.response?.data?.message ||
            "Failed to send message"
        )
      );
    }
  };

  export const editMessage =
  ({ messageId, data }) =>
  async (dispatch) => {
    try {
      const updated =
        await messageService.editMessage({
          messageId,
          data,
        });

      dispatch(updateMessage(updated));
    } catch (err) {
      dispatch(
        setError(
          err.response?.data?.message ||
            "Failed to update message"
        )
      );
    }
    };
  
    export const deleteMessage =
  (messageId) => async (dispatch) => {
    try {
      await messageService.deleteMessage(
        messageId
      );

      dispatch(removeMessage(messageId));
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