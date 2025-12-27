

import React, { useEffect, useRef, useState } from "react";
import socket from "../socket";
import axios from "axios";


const Chatbox = ({ Username,email, Darkmode }) => {
  const [Messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [Selectmsg, Setselectmsg] = useState("");
  const [Menuposition,Setmenuposition] = useState({ x: 0, y: 0 })
  const [Showmenu, Setshowmenu] = useState(false)
  const [EditingmsId , setEditingmsgId] = useState(null)
  const [Edittext, setEdittext] = useState("")

  const HandelonsaveEditmsg = (id) => {
    if (Edittext == "") {
      alert("msg is empty")
      return;
    }
    socket.emit("edit-msg", {
      id,
      newText:Edittext
    })
 setEditingmsgId(null)
  
  }

  const HandelonEditmsg = ( Selectmsg) => {
    setEditingmsgId(Selectmsg._id);
    setEdittext(Selectmsg.message)
    Setshowmenu(false)
  }
  

 

  const formatTime = (timestamp) => {
      const now = new Date(timestamp);
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${ampm}`;
    };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    // After receiving message from backend
    
    const msg = {
      user: Username,
      message: newMessage,
      email:email,
    };

    socket.emit("send-message", msg);
    setNewMessage("");
  };
  const menuref = useRef(null);
  useEffect(() => {
  const handleOnCickoutside = (e) => {
      
      if (menuref.current && !menuref.current.contains(e.target)) {
        Setshowmenu(false)
      }
    }
      document.addEventListener("mousedown", handleOnCickoutside)
    document.addEventListener("touchstart", handleOnCickoutside)
    return () => {
       document.removeEventListener('mousedown', handleOnCickoutside)
          document.removeEventListener("touchstart",handleOnCickoutside)
    }
    },[])


  useEffect(() => {
  
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/chats")
        setMessages(res.data);
        
      } catch (error) {
        console.log("failed to fetched the chathistory",error)
      }
    }
    fetchHistory();
    socket.on("received-message", (Message) => {
      console.log("received msg", Message)
      setMessages((prev) => [...prev, Message]);
    });
    socket.on("msg-deleted", (id) => {
      setMessages((prev) => prev.filter((m) => m._id !== id))
    });
    socket.on("message_updated",(updatedmsg)=>
    setMessages((prev) =>
      prev.map((m) => m._id == updatedmsg._id ? updatedmsg : m
    )
  ))
       return () => {
      socket.off("received-message")
         socket.off("chat-history")
         socket.off("msg-deleted")
         socket.off("updated-msg")
        
    };
  }, []);

  //for editedmsg
  
  
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [Messages]);
  const handleContexmenu = (e,msg) => {
    e.preventDefault();
    Setselectmsg(msg);
    Setmenuposition({ x: e.pageX, y: e.pageY });
    Setshowmenu(true);
  }
  const touchref = useRef(null);
  const handleontouch = (e,msg) => {
    touchref.current= setTimeout(() => {
      Setselectmsg(msg);
      Setmenuposition({
        x: e.touches[0].pageX,
        y:e.touches[0].pageY
      })
      Setshowmenu(true)
    },500)
  }
  const handeloneEnd = () => {
    clearTimeout(touchref.current);
  }
  const handleonDelete = () => {
    socket.emit("deleted-msg", Selectmsg._id )
    Setshowmenu(false);
  }

  return (
    <div
      className={`${
        Darkmode ? "dark-mode" : "light-mode"
      } flex flex-col justify-center items-center h-screen p-4`}
    >
      <div
        className={`${
          Darkmode ? "dark-mode" : "light-mode"
        } text-2xl font-bold mb-4`}
      >
        Your chat is here
      </div>

      <div
        // ref={scrollref}
        className={` scroll-bar ${
          Darkmode ? "dark-mode" : "light-mode"
          }  w-full max-w-md h-90 overflow-y-scroll  flex flex-col`}
        // onScroll={handelOnscroll}
      >
        {Messages.map((msg) => (
          <div
           key={msg._id}
            className={`p-2 mb-2 rounded-lg max-w-[40%] wrap-break-word
    whitespace-pre-wrap
    ${
              msg.user === Username
                ? `${
                    Darkmode ? "dark-mode" : "light-mode"
                  } ml-auto bg-blue-500 text-white`
                : `${
                    Darkmode ? "dark-mode" : "light-mode"
                  } bg-gray-300 text-black`
            }`}
          >
            <div  onContextMenu={(e) => { handleContexmenu(e, msg) }}
            onTouchStart={(e) => { handleontouch(e,msg) }}
            onTouchEnd={handeloneEnd} className=" p-1 border-2 rounded-2xl ">
            <strong>
              {msg.user.charAt(0).toUpperCase() + msg.user.slice(1)}:{" "}
              </strong>
              {EditingmsId === msg._id ? <input value={Edittext}
                onChange={(e)=> setEdittext(e.target.value)}
                className="border rounded p-1 text-black "
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    HandelonsaveEditmsg(msg._id);
                  }
                  if (e.key == "Escape") {
                    setEditingmsgId(null)
                  }
              } }
              ></input> :
            msg.message}
              <div className="text-xs text-gray-500 mt-1 ">{formatTime(msg.time)}</div>
              { msg.edited && <div className="text-black text-xs"> edited</div>}
              </div>
            {Showmenu && (
              <div
                ref={menuref}
        className="fixed bg-white rounded p-2 z-50"
        style={{ top: Menuposition.y, left: Menuposition.x }}
      >
         <button onClick={()=>{HandelonEditmsg(Selectmsg)}} className="block w-full text-left">
          ✏️ Edit
        </button> 
        <button
          onClick={handleonDelete}
          className="block w-full text-left text-red-500"
        >
          🗑 Delete
        </button>
      </div>
    )}
          </div>
        ))}
      
        <div  ref={bottomRef}></div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mt-4 w-full max-w-md">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className={`${
            Darkmode ? "dark-mode" : "light-mode"
          } flex-1 p-2 rounded border`}
        />
        <button
          type="submit"
          className={`${
            Darkmode ? "dark-mode" : "light-mode"
          } p-2 rounded font-bold`}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbox;
