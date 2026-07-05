import { createSlice } from "@reduxjs/toolkit";
import conversationService from "./conversationService";

const initialState = {
  conversations: [],
  selectedConversation: null,
  lastOpenedConversation: null,
  isLoading: true,
  isError: false,
  message: "",
   conversations: [],
  unreadCounts: {}, // { conversationId: count }
   deletedAtMap: {},// { conversationId: deletedAt }
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
    console.log("new conversation is added");
    state.conversations.unshift(action.payload);
  } else {
    // ✅ already exists — update it with fresh populated data
    console.log("converstaion is already exist");
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
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },

      incrementUnread: (state, action) => {
    const { conversationId } = action.payload;
    if (conversationId !== state.activeConversationId) {
      state.unreadCounts[conversationId] = (state.unreadCounts[conversationId] || 0) + 1;
    }
    },
       clearUnreadCount: (state, action) => {
    state.unreadCounts[action.payload] = 0;
    },
         setUnreadCounts: (state, action) => {
    state.unreadCounts = action.payload; // hydrate on initial load
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
  setUnreadCounts,
  incrementUnread,
  clearUnreadCount,
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

      const response =
       await conversationService.getConversation();
      console.log("API response from fetch conversations:", response);
      dispatch(setConversations(response));
        // build { conversationId: count } map from the response
    const counts = {};
    response.conversations.forEach((conv) => {
      counts[conv._id] = conv.unreadCount || 0;
    });
      dispatch(setUnreadCounts(counts));
      console.log("unreadcounts on fetchconversations", counts);
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

      const response =
        await conversationService.createConversation(
          receiverId
        );
      const { conversation, deletedAt } = response;
      console.log("thus is deletedAt createconversations", deletedAt);
      console.log("this is conversation from the create ", conversation);
      dispatch(addConversation(conversation));
       dispatch(setSelectedConversation(conversation));
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
   
      const response=
      await conversationService.deleteConversation(
        conversationId
        );
      const { conversation, message } = response
      console.log("this is response",response);
      console.log("this is delted conversations from slice ", conversation);
     dispatch(
        deleteConversation(conversationId)
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