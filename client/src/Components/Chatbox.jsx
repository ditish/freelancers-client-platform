/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import socket from "../socket";

const Chatbox = ({ Username }) => {
  const [Messages, Setmessages] = useState([]);
  const [newMessage, SetnewMessage] = useState("");
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  const handleOnsubmit = (e) => {
    e.preventDefault();
    const Messagedata = 
      {
        Message: newMessage,
        user: Username,
        time: `${hours}:${minutes} ${ampm}`,
      }
    
    socket.emit("send-message", Messagedata);
    SetnewMessage(" ");
  };
  useEffect(() => {
    socket.on("recived-message", (Message) => {
      console.log("message is received", Message);

      Setmessages(prevMessages => [...prevMessages, Message]);
      
    });
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen  ">
      <div className="text-2xl  text-white">your chat is here </div>
      <div className="h-[60vh] w-[60vw] scrollbar overflow-y-scroll">
  {Messages.map((message, index) => {
    return (
      <div key={index} className={`flex ${Username === message.user? "justify-start" : "justify-end"}`} >
        <div className="inline-flex gap-2 border border-white rounded-2xl m-2 p-2 text-white max-w-[70%]">
          
          {/* Avatar */}
          <h1 className="text-2xl font-bold">
            {message.user.charAt(0).toUpperCase()}
          </h1>

          {/* Message text */}
          <span className="bg-amber-300 text-white px-2 py-1 rounded-lg">
            {message.Message}
          </span>

          {/* Time */}
          <span className="self-end text-xs text-gray-300">
            {message.time}
          </span>

        </div>
      </div>
    );
  })}
</div>

      <form onSubmit={(e) => handleOnsubmit(e)}>
        <input
          type="text"
          className=" input"
          name="newMessage"
          placeholder="type message here "
          value ={newMessage}
          onChange={(e) => SetnewMessage(e.target.value)}
          
        />
        {newMessage== ""? "":<button type="submit" className="submit p-2 m-1">
          send
        </button>}
       
      </form>
    </div>
  );
};

// export default Chatbox;
// import React, { useEffect, useState } from "react";
// import socket from "../socket";

// const Chatbox = ({ Username }) => {
//   const [Messages, Setmessages] = useState([]);
//   const [newMessage, SetnewMessage] = useState("");

//   const handleOnsubmit = (e) => {
//     e.preventDefault();
//     if (newMessage.trim() === "") return;

//     const now = new Date();
//     let hours = now.getHours();
//     const minutes = now.getMinutes().toString().padStart(2, "0");
//     const ampm = hours >= 12 ? "PM" : "AM";
//     hours = hours % 12 || 12;

//     const Messagedata = {
//       Message: newMessage,
//       user: Username,
//       time: `${hours}:${minutes} ${ampm}`,
//     };

//     socket.emit("send-message", Messagedata);
//     SetnewMessage(""); // clear input
//   };

//   useEffect(() => {
//     const handleMessage = (Message) => {
//       console.log("message is received", Message);
//       Setmessages(prev => [...prev, Message]);
//     };


//     socket.on("recived-message", handleMessage);

//     return () => {
//       socket.off("recived-message", handleMessage);
//     };
//   }, []);

//   return (
//     <div className="flex flex-col justify-center items-center h-screen">
//       <div className="text-2xl text-white">Your chat is here</div>

//       <div className="chat-box mt-4 w-full max-w-md">
//         {Messages.map((msg, index) => (
//           <div key={index} className="text-white mb-1">
//             <strong>{msg.user}: </strong> {msg.Message}{" "}
//             <span className="text-gray-400 ml-2 text-sm">{msg.time}</span>
//           </div>
//         ))}
//       </div>

//       <form onSubmit={handleOnsubmit} className="mt-4 flex gap-2">
//         <input
//           type="text"
//           className="flex-1 border rounded p-2"
//           value={newMessage}
//           onChange={(e) => SetnewMessage(e.target.value)}
//         />
//         <button type="submit" className="bg-blue-500 text-white p-2 rounded">
//           Send
//         </button>
//       </form>
//     </div>
//   );
// };

export default Chatbox;

