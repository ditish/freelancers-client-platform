import { createSlice } from "@reduxjs/toolkit";
import conversationService from "./conversationService";

const initialState = {
  conversations: [],
  selectedConversation: null,
  lastOpenedConversation: null,
  isLoading: true,
  isError: false,
  message: "",
};

const conversationSlice = createSlice({
  name: "conversations",
  initialState,reducers: {
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
  const exists = state.conversations.find(
    (c) => c._id === action.payload._id
  );

  if (!exists) {
    // ✅ new conversation — add to top
    state.conversations.unshift(action.payload);
  } else {
    // ✅ already exists — update it with fresh populated data
    state.conversations = state.conversations.map((c) =>
      c._id === action.payload._id ? action.payload : c
    );
  }

  state.isLoading = false;
  state.isError = false;
  state.message = "";
},

    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
  localStorage.setItem("selectedConversation", JSON.stringify(action.payload));
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
    setLastConversation: (state, action) => {
  const { conversationId } = action.payload;
  state.lastOpenedConversation = conversationId;
    },
    updateLastmessage: (state, action) => {
    const { conversationId, text } = action.payload;
        console.log("this is text", text);
      console.log("this is converstaionId ", conversationId)
    const convo = state.conversations.find(c => c._id === conversationId);
    if (convo) {
      convo.lastMessage = text;
    }
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
  setLastConversation,
  updateLastmessage,
  setError,
} = conversationSlice.actions;

export const fetchConversations =
  () => async (dispatch) => {
    try {
      dispatch(setLoading(true));

      const conversations =
        await conversationService.getConversation();
          console.log("API response:", conversations);

      dispatch(setConversations(conversations));
    } catch (err) {
       console.log("API error:", err)
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
      console.log("this is recievr id on conevrsationslice", receiverId);
      dispatch(setLoading(true));

      const conversation =
        await conversationService.createConversation(
          receiverId
        );

      dispatch(addConversation(conversation));
      return conversation
    } catch (err) {
      dispatch(
        setError(
          err.response?.data?.message ||
            "Failed to create conversation"
        )
      );
    }
  };
export const updateLastConversation =
  (conversationId) => async (dispatch) => {
    try {
      await conversationService.updateLastConversation(conversationId);
      dispatch(setLastConversation({ conversationId }));
    } catch (err) {
      dispatch(
        setError(
          err.response?.data?.message ||
            "Failed to update last conversation"
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