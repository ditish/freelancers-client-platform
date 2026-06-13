import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearMessages, fetchMessages, sendMessage,addMessage } from "../src/features/message/messageSlice";
import { fetchConversations, setSelectedConversation } from "../src/features/conversation/convesationSlice"; 
import socket from "../src/utiles/Socket"

const ChatPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isloadingUser } = useSelector((state) => state.auth);
  const { conversations, selectedConversation, isLoading } = useSelector((state) => state.conversations);
  const { messages } = useSelector((state) => state.messages);

  const [text, setText] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const getUserId = (user) => user?._id || user?.id;
// Join conversation room when selected


  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  useEffect(() => {
    if (selectedConversation?._id) {
      dispatch(fetchMessages(selectedConversation._id));
    }
    return () => { dispatch(clearMessages()); };
  }, [selectedConversation, dispatch]);





// Listen for new messages
useEffect(() => {
  if (!selectedConversation?._id) return;

  // Join the conversation room
  socket.emit("join-chat", selectedConversation._id);



  // Listen for incoming messages
  socket.on("receive-message", (message) => {

        const myId = user?._id || user?.id;    
  const senderId = message.sender?._id || message.sender; 
   console.log("myId:", myId, "senderId:", senderId);
    console.log("recive message", message);
      if (senderId?.toString() !== myId?.toString()) {
    //  Only add if someone ELSE sent it
    dispatch(addMessage(message));
  }});
return () => {
    socket.off("receive-message"); // ✅ cleanup on conversation change
  };
}, [selectedConversation]);
  

  useEffect(() => {
    const container = messagesContainerRef.current;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 300);
    };
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async() => {
    if (!text.trim() || !selectedConversation?._id) return;
 const savedMessage = await  dispatch(sendMessage({ conversationId: selectedConversation._id, text }))
    // Emit to other participants via socket
      if (savedMessage) {
    console.log("savedMessage to emit:", savedMessage);
       socket.emit("send-message", {
        ...savedMessage,
        conversationId: selectedConversation._id,
      });
    }
    ;
    setText("");
  };

  const getOtherParticipant = (conv) => {
    if (!conv?.participants) return null;
    const userId = getUserId(user);
    return conv.participants.find((p) => {
      const id = p?._id?.toString() ?? p?.toString();
      return id !== userId?.toString();
    });
  };

  const getDisplayName = (participant) => {
    if (!participant) return "Unknown";
    if (typeof participant === "object") return participant.name || "Unknown";
    return "User";
  };

  if (!user || isLoading || isloadingUser) return (
    <div className="flex h-screen items-center justify-center text-gray-400">Loading...</div>
  );

  return (
    <div className="flex h-screen">

      {/* LEFT SIDEBAR */}
      <div className="w-1/3 border-r overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No conversations yet
          </div>
        ) : (
          conversations.map((conv) => {
            const otherParticipant = getOtherParticipant(conv);
            return (
              <div
                key={conv._id}
                onClick={() => dispatch(setSelectedConversation(conv))}
                className={`p-4 cursor-pointer border-b hover:bg-gray-100 ${
                  selectedConversation?._id === conv._id ? "bg-gray-200" : ""
                }`}
              >
                <p className="font-semibold">{getDisplayName(otherParticipant)}</p>
                <p className="text-sm text-gray-500 truncate">
                  {conv?.lastMessage || "No messages yet"}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="w-2/3 flex flex-col">

        {!selectedConversation ? (
          // ✅ Empty state — covers both new user and no selection
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
            <p className="text-4xl mb-3">💬</p>
            {conversations.length === 0 ? (
              // New user — no conversations at all
              <>
                <p className="text-lg font-medium text-gray-600">No conversations yet</p>
                <p className="text-sm mt-1 mb-4">Find a freelancer and start chatting</p>
                <button
                  onClick={() => navigate("/freelancers")}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Browse Freelancers
                </button>
              </>
            ) : (
              // Has conversations but none selected
              <>
                <p className="text-lg font-medium text-gray-600">No conversation selected</p>
                <p className="text-sm mt-1">Select a conversation from the left</p>
              </>
            )}
          </div>
        ) : (
          // ✅ Conversation selected — show header, messages, input
          <>
            {/* Header */}
            <div className="p-4 border-b font-bold">
              {getDisplayName(getOtherParticipant(selectedConversation))}
            </div>

            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 relative bg-gray-50">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400">
                  Start the conversation 💬
                </div>
              ) : (
                messages.map((msg) => {
                  const userId = getUserId(user);
                  const isOther = msg.sender?._id?.toString() !== userId?.toString();
                  const time = new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div key={msg._id} className={`mb-3 flex flex-col ${isOther ? "items-start" : "items-end"}`}>
                      {isOther && (
                        <span className="text-xs text-gray-500 mb-1 ml-1">
                          {msg.sender?.name || "User"}
                        </span>
                      )}
                      <div className={`px-3 py-2 rounded-lg max-w-xs shadow-sm ${
                        isOther
                          ? "bg-white text-gray-800 rounded-tl-none"
                          : "bg-green-500 text-white rounded-tr-none"
                      }`}>
                        <p className="text-sm">
                          {msg.isDeleted ? (
                            <span className="italic text-gray-400">This message was deleted</span>
                          ) : (
                            msg.text
                          )}
                        </p>
                        <p className={`text-xs mt-1 text-right ${isOther ? "text-gray-400" : "text-green-100"}`}>
                          {time}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}

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

            {/* Input */}
            <div className="p-3 border-t flex">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
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
          </>
        )}
      </div>

    </div>
  );
};

export default ChatPage;