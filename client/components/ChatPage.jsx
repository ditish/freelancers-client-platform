import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearMessages, fetchMessages, sendMessage,addMessage, deleteMessage, editMessage } from "../src/features/message/messageSlice";
import { deleteConversationById, fetchConversations, setSelectedConversation, updateLastmessage } from "../src/features/conversation/convesationSlice"; 
import socket from "../src/utiles/Socket"

const ChatPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isloadingUser } = useSelector((state) => state.auth);
  const { conversations, selectedConversation, isLoading } = useSelector((state) => state.conversations);
  const { messages } = useSelector((state) => state.messages);
  console.log("this is message in chatpage", messages);
  const [contextMenu, setContextMenu] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
const [Editmessage, setEditmessage] = useState(null);
  const [text, setText] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
   const conversationsRef = useRef(conversations);

  const getUserId = (user) => user?._id || user?.id;
// Join conversation room when selected


  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  useEffect(() => {
  conversationsRef.current = conversations;
}, [conversations]);

  useEffect(() => {
  if (conversations.length === 0) return;
    if (selectedConversation?._id) return;
  const latestConversation = conversations[0];

  if (latestConversation) {
      dispatch(setSelectedConversation(latestConversation));
    }
  
}, [conversations]);

  useEffect(() => {
    if (selectedConversation?._id) {
      dispatch(fetchMessages(selectedConversation._id));
    }
    return () => {
       dispatch(clearMessages());
       console.log("clearing the messeage")
     };
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
        
 // check if this conversation exists in current sidebar list
      const convExists = conversationsRef.current.some( // ✅ always fresh via ref
        c => c._id?.toString() === message.conversationId?.toString()
      );
      
         if (!convExists) {
      //  conversation X was deleted from sidebar — fetch it fresh to add it back
      dispatch(fetchConversations()); // re-fetch full list (aggregation will include X now since updatedAt > deletedAt)
    } else {
      // already in sidebar — just update its lastMessage and bump to top
      dispatch(updateLastmessage({ 
        conversationId: message.conversationId, 
        text: message.text 
      }));
      }
        // only add to main chat view if X is the one currently open
    if (message.conversationId?.toString() === selectedConversation?._id?.toString()) {
      dispatch(addMessage(message));
    }

   
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

  const handelOndelete = (selectedId) => {
    console.log("deleted conversationId ", selectedId)
    dispatch(deleteConversationById(selectedId));
  }
const handleSend = async() => {
    if (!text.trim() || !selectedConversation?._id) return;
  if (Editmessage) {
    // Handle edit
    dispatch(editMessage({ messageId: Editmessage._id, text,conversationId:selectedConversation._id }));
    setEditmessage(null);
    setText("");
    return;
  }
const savedMessage = await  dispatch(sendMessage({ conversationId: selectedConversation._id, text, replyTo: replyTo?._id || null, }))
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
    setReplyTo(null);
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
                onClick={() =>
                  dispatch(setSelectedConversation(conv))}
                className={`p-4 cursor-pointer border-b hover:bg-gray-100 ${
                  selectedConversation?._id === conv._id ? "bg-gray-200" : ""
                }`}
              >
                <p className="font-semibold">{getDisplayName(otherParticipant)}</p>
                <p className="text-sm text-gray-500 truncate">
                   {conv?.lastMessage !== undefined && conv?.lastMessage !== "" 
    ? conv.lastMessage 
    : "No messages yet"}
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
              <div className=" flex border-b  justify-between">
            <div className="p-4 font-bold">
                {getDisplayName(getOtherParticipant(selectedConversation))}
                </div> 
                <div
                  onClick={() => {
                    handelOndelete(selectedConversation._id);
                }}
                  className="p-1 cursor-pointer m-2">Delete</div>
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
                    <div key={msg._id} className={`mb-3 flex flex-col ${isOther ? "items-start" : "items-end"}`}
                      onContextMenu={(e) => {
                        if (msg.isDeleted) return; 
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, msg });
  }}
                    
                    >
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
                        
   {/*  Reply preview inside the bubble */}
  {msg.replyTo && !msg.isDeleted && (
    <div className={`text-xs px-2 py-1 rounded mb-1 border-l-2 ${
      isOther
        ? "bg-gray-100 border-gray-400 text-gray-500"
        : "bg-green-600 border-green-200 text-green-100"
    }`}>
      <p className="font-semibold">
        {msg.replyTo.sender?.name || "User"}
      </p>
      <p className="truncate">
        {msg.replyTo.text || "Original message deleted"}
      </p>
    </div>
  )}

                        <p className="text-sm">
                          {msg.isDeleted ? (
                            <span className="italic text-white">This message was deleted</span>
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
              
 {replyTo && (
    <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded mb-2 text-sm">
      <span className="text-gray-500">
        Replying to: <span className="font-medium">{replyTo.text}</span>
      </span>
      <button onClick={() => setReplyTo(null)} className="text-gray-400 hover:text-gray-600">✕</button>
    </div>
  )}

  {/* Edit preview */}
  {Editmessage && (
    <div className="flex items-center justify-between bg-yellow-50 px-3 py-2 rounded mb-2 text-sm">
      <span className="text-gray-500">
        Editing: <span className="font-medium">{Editmessage.text}</span>
      </span>
      <button onClick={() => { setEditmessage(null); setText(""); }} className="text-gray-400 hover:text-gray-600">✕</button>
    </div>
  )}

{/* Input */}
            <div className="p-3 border-t flex">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 border rounded px-3 py-2"
                  placeholder={Editmessage ? "Edit message..." : "Type a message..."}
              />
              <button
                onClick={handleSend}
                  className="ml-2 bg-blue-600 text-white px-4 py-2 rounded"
                  
              >
                   {Editmessage ? "Update" : "Send"}
              </button>
            </div>
          </>
        )}
      </div>
 {contextMenu && (
  <>
    {/* Backdrop — click outside to close */}
    <div
      className="fixed inset-0 z-10"
      onClick={() => setContextMenu(null)}
    />

    {/* Menu */}
    <div
      className="fixed z-20 bg-white rounded-lg shadow-xl border py-1 w-48"
      style={{ top: contextMenu.y, left: contextMenu.x }}
    >
      {/* Reply */}
      <button
        onClick={() => {
          setReplyTo(contextMenu.msg);
          setContextMenu(null);
        }}
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
      >
        ↩️ Reply
      </button>

      {/* Copy */}
      <button
        onClick={() => {
          navigator.clipboard.writeText(contextMenu.msg.text);
          setContextMenu(null);
        }}
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
      >
        📋 Copy
      </button>

      {/* Edit — only for your own messages */}
      {contextMenu.msg.sender?._id?.toString() === getUserId(user)?.toString() && (
        <button
          onClick={() => {
            setEditmessage(contextMenu.msg);
            setText(contextMenu.msg.text);
            setContextMenu(null);
          }}
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
        >
          ✏️ Edit
        </button>
      )}

      {/* Delete — only for your own messages */}
      {contextMenu.msg.sender?._id?.toString() === getUserId(user)?.toString() && (
        <button
          onClick={() => {
            dispatch(deleteMessage(contextMenu.msg._id,selectedConversation._id));
            setContextMenu(null);
          }}
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-red-500"
        >
          🗑️ Delete
        </button>
      )}
    </div>
  </>
      )}


      
    </div>
  );
};

export default ChatPage;