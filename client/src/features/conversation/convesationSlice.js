import { createSlice } from "@reduxjs/toolkit";
import conversationService from "./conversationService";

const initialState = {
  conversations: [],
  selectedConversation: null,
  isLoading: false,
  isError: false,
  message: "",
};

const conversationSlice = createSlice({
  name: "conversations",
  initialState,

  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setConversations: (state, action) => {
      state.conversations = action.payload.conversations || [];

      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },

    addConversation: (state, action) => {
      state.conversations.unshift(action.payload);

      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },

    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;

      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },

    deleteConversation: (state, action) => {
      state.conversations = state.conversations.filter(
        (conversation) =>
          conversation._id !== action.payload
      );

      if (
        state.selectedConversation?._id ===
        action.payload
      ) {
        state.selectedConversation = null;
      }

      state.isLoading = false;
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
  setConversations,
  addConversation,
  setSelectedConversation,
  deleteConversation,
  setError,
} = conversationSlice.actions;

export const fetchConversations =
  () => async (dispatch) => {
    try {
      dispatch(setLoading(true));

      const conversations =
        await conversationService.getConversations();

      dispatch(setConversations(conversations));
    } catch (err) {
      dispatch(
        setError(
          err.response?.data?.message ||
            "Failed to fetch conversations"
        )
      );
    }
  };

  export const createConversation =
  (receiverId) => async (dispatch) => {
    try {
      dispatch(setLoading(true));

      const conversation =
        await conversationService.createConversation(
          receiverId
        );

      dispatch(addConversation(conversation));
    } catch (err) {
      dispatch(
        setError(
          err.response?.data?.message ||
            "Failed to create conversation"
        )
      );
    }
  };
  export const deleteConversationById =
  (conversationId) => async (dispatch) => {
    try {
      dispatch(setLoading(true));

      await conversationService.deleteConversation(
        conversationId
      );

      dispatch(
        removeConversation(conversationId)
      );
    } catch (err) {
      dispatch(
        setError(
          err.response?.data?.message ||
            "Failed to delete conversation"
        )
      );
    }
  };
  export default  conversationSlice.reducer;