import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessages,  fetchMessages,
  sendMessage,
} from "../src/features/message/messageSlice";
import { fetchConversations,setSelectedConversation } from "../src/features/conversation/convesationSlice";
 



const ChatPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const { conversations, selectedConversation } =
    useSelector((state) => state.conversations);

  const { messages } = useSelector(
    (state) => state.messages
  );

  const [text, setText] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
const messagesContainerRef = useRef(null);

  const messagesEndRef = useRef(null);

  // Load conversations on page load
  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  // Load messages when conversation changes
  useEffect(() => {
    if (selectedConversation?._id) {
      dispatch(
        fetchMessages(selectedConversation._id)
      );
    }

    return () => {
      dispatch(clearMessages());
    };
  }, [selectedConversation, dispatch]);


  useEffect(() => {
  const container = messagesContainerRef.current;

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } =
      container;

    const distanceFromBottom =
      scrollHeight - scrollTop - clientHeight;

    setShowScrollButton(distanceFromBottom > 300);
  };

  container?.addEventListener(
    "scroll",
    handleScroll
  );

  return () =>
    container?.removeEventListener(
      "scroll",
      handleScroll
    );
}, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Send message
  const handleSend = () => {
    if (!text.trim()) return;

    dispatch(
      sendMessage({
        conversationId: selectedConversation._id,
        text,
      })
    );

    setText("");
  };
  conversations.map((conv) => {
    const otherUser = conv?.participants?.find(
      (p) => p._id.toString() !== user._id.toString()
    )
  });
  return (
    <div className="flex h-screen">
      {/* LEFT SIDEBAR - Conversations */}
      <div className="w-1/3 border-r overflow-y-auto">
        {
          conversations.length === 0 ? (
    <div className="flex items-center justify-center h-full text-gray-500">
      No conversations yet
    </div>):(conversations.map((conv) => (
          <div
            key={conv._id}
            onClick={() =>
              dispatch(setSelectedConversation(conv))
            }
            className={`p-4 cursor-pointer border-b hover:bg-gray-100 ${
              selectedConversation?._id === conv._id
                ? "bg-gray-200"
                : ""
            }`}
          >
            <p className="font-semibold">
              {otherUser.name}
            </p>

            <p className="text-sm text-gray-500 truncate">
              {conv?.lastMessage || "No messages yet"}
            </p>
          </div>
        )))}
      </div>

      {/* RIGHT SIDE - Messages */}
      <div className="w-2/3 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b font-bold">
          {selectedConversation
            ? selectedConversation.participants
                .map((p) => p.name)
                .join(" & ")
            : "Select a chat"}
        </div>

        {/* Messages */}
        <div
           ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 relative">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`mb-2 flex ${
                msg.sender?._id ===
                selectedConversation?.participants?.[0]?._id
                  ? "justify-start"
                  : "justify-end"
              }`}
            >
              <div className="bg-blue-500 text-white px-3 py-2 rounded-lg max-w-xs">
                {msg.isDeleted
                  ? "This message was deleted"
                  : msg.text}
              </div>
            </div>
          ))}
            {showScrollButton && (
    <button
      onClick={scrollToBottom}
      className="fixed bottom-24 right-10 bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg"
    >
      ↓
    </button>
  )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        {selectedConversation && (
          <div className="p-3 border-t flex">
            <input
              value={text}
              onChange={(e) =>
                setText(e.target.value)
              }
              className="flex-1 border rounded px-3 py-2"
              placeholder="Type a message..."
            />

            <button
              onClick={handleSend}
              className="ml-2 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;