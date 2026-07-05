import React from "react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import  socket  from "../src/utiles/Socket";
import {
  updateLastmessage,
  incrementUnread,
} from "../src/features/conversation/convesationSlice";

import {
addMessage
} from "../src/features/message/messageSlice";


const ReceiveMessageListener = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const conversations = useSelector((state) => state.conversations.conversations);
  const selectedConversation = useSelector(
    (state) => state.conversations.selectedConversation
  );
  const selectedConversationRef = useRef(selectedConversation);
 useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);
  // Join every conversation room the user is part of
  useEffect(() => {
    if (!conversations || conversations.length === 0) return;
    conversations.forEach((conv) => {
      socket.emit("join-chat", conv._id);
    });
  }, [conversations]);

  // Listen for incoming messages, app-wide
  useEffect(() => {
    if (!user?._id) return;

    socket.off("receive-message");
    socket.on("receive-message", (message) => {
      const myId = user?._id || user?.id;
      const senderId = message.sender?._id || message.sender;

      if (senderId?.toString() !== myId?.toString()) {
        const isActiveConversation =
          message.conversationId?.toString() ===
          selectedConversationRef.current?._id?.toString();

        dispatch(
          updateLastmessage({
            conversationId: message.conversationId,
            text: message.text,
          })
        );

        if (isActiveConversation) {
          dispatch(addMessage(message));
          socket.emit("markAsRead", {
            conversationId: message.conversationId,
            userId: myId,
          });
        } else {
          dispatch(incrementUnread({ conversationId: message.conversationId }));
        }
      }
    });

    return () => socket.off("receive-message");
  }, [user]);

  return null;
};

export default ReceiveMessageListener;