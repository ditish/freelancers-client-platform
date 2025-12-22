// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useEffect, useState } from "react";
// import socket from "../socket";

// const Chatbox = ({ Username }) => {
//   const [Messages, Setmessages] = useState([]);
//   const [newMessage, SetnewMessage] = useState("");
//   const now = new Date();
//   let hours = now.getHours();
//   const minutes = now.getMinutes().toString().padStart(2, "0");
//   const ampm = hours >= 12 ? "PM" : "AM";
//   hours = hours % 12 || 12;

//   const handleOnsubmit = (e) => {
//     e.preventDefault();
//     const Messagedata =
//       {
//         Message: newMessage,
//         user: Username,
//         time: `${hours}:${minutes} ${ampm}`,
//       }
    
//     socket.emit("send-message", Messagedata);
//     SetnewMessage(" ");
//   };
//   useEffect(() => {
//     socket.on("recived-message", (Message) => {
//       console.log("message is received", Message);

//       Setmessages(prevMessages => [...prevMessages, Message]);
      
//     });
//   }, []);

//   return (
//     <div className="flex flex-col justify-center items-center h-screen  ">
//       <div className="text-2xl  text-black">your chat is here </div>
//       <div className="h-[60vh] w-[60vw] scrollbar overflow-y-scroll">
//   {Messages.map((message, index) => {
//     return (
//       <div key={index} className={`flex ${Username === message.user? "justify-start" : "justify-end"}`} >
//         <div className="inline-flex gap-2 border border-gray-500 rounded-2xl m-2 p-2 dark:text-white text-black max-w-[70%]">
          
//           {/* Avatar */}
//           <h1 className="text-2xl font-bold">
//             {message.user.charAt(0).toUpperCase()}
//           </h1>

//           {/* Message text */}
//           <span className="dark:text-white text-black px-2 py-1 rounded-lg">
//             {message.Message}
//           </span>

//           {/* Time */}
//           <span className="self-end text-xs dark:text-white text-black">
//             {message.time}
//           </span>

//         </div>
//       </div>
//     );
//   })}
// </div>

//       <form onSubmit={(e) => handleOnsubmit(e)}>
//         <input
//           type="text"
//           className=" border border-black "
//           name="newMessage"
//           placeholder="type message here "
//           value ={newMessage}
//           onChange={(e) => SetnewMessage(e.target.value)}
          
//         />
//         {newMessage== ""? "":<button type="submit" className="  submit dark:text-black p-2 m-1 border text-white font-bold dark:border-white border-black ">
//           send
//         </button>}
       
//       </form>
//     </div>
//   );
// };

// // export default Chatbox;
// // import React, { useEffect, useState } from "react";
// // import socket from "../socket";

// // const Chatbox = ({ Username }) => {
// //   const [Messages, Setmessages] = useState([]);
// //   const [newMessage, SetnewMessage] = useState("");

// //   const handleOnsubmit = (e) => {
// //     e.preventDefault();
// //     if (newMessage.trim() === "") return;

// //     const now = new Date();
// //     let hours = now.getHours();
// //     const minutes = now.getMinutes().toString().padStart(2, "0");
// //     const ampm = hours >= 12 ? "PM" : "AM";
// //     hours = hours % 12 || 12;

// //     const Messagedata = {
// //       Message: newMessage,
// //       user: Username,
// //       time: `${hours}:${minutes} ${ampm}`,
// //     };

// //     socket.emit("send-message", Messagedata);
// //     SetnewMessage(""); // clear input
// //   };

// //   useEffect(() => {
// //     const handleMessage = (Message) => {
// //       console.log("message is received", Message);
// //       Setmessages(prev => [...prev, Message]);
// //     };


// //     socket.on("recived-message", handleMessage);

// //     return () => {
// //       socket.off("recived-message", handleMessage);
// //     };
// //   }, []);

// //   return (
// //     <div className="flex flex-col justify-center items-center h-screen">
// //       <div className="text-2xl text-white">Your chat is here</div>

// //       <div className="chat-box mt-4 w-full max-w-md">
// //         {Messages.map((msg, index) => (
// //           <div key={index} className="text-white mb-1">
// //             <strong>{msg.user}: </strong> {msg.Message}{" "}
// //             <span className="text-gray-400 ml-2 text-sm">{msg.time}</span>
// //           </div>
// //         ))}
// //       </div>

// //       <form onSubmit={handleOnsubmit} className="mt-4 flex gap-2">
// //         <input
// //           type="text"
// //           className="flex-1 border rounded p-2"
// //           value={newMessage}
// //           onChange={(e) => SetnewMessage(e.target.value)}
// //         />
// //         <button type="submit" className="bg-blue-500 text-white p-2 rounded">
// //           Send
// //         </button>
// //       </form>
// //     </div>
// //   );
// // };

// export default Chatbox;


import React, { useEffect, useState } from "react";
import socket from "../socket";

const Chatbox = ({ Username, Darkmode }) => {
  const [Messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    const msg = {
      user: Username,
      message: newMessage,
      time: `${hours}:${minutes} ${ampm}`,
    };

     socket.emit("send-message", msg);
// //     SetnewMessage(""); // clear input
    setNewMessage("");
  };
   useEffect(() => {
    const handleMessage = (Message) => {
      console.log("message is received", Message);
      setMessages(prev => [...prev, Message]);
    };


    socket.on("recived-message", handleMessage);

    return () => {
      socket.off("recived-message", handleMessage);
    };
  }, []);

  return (
    <div className={`${Darkmode ? "dark-mode" : "light-mode"} flex flex-col justify-center items-center h-screen p-4`}>
      <div className={`${Darkmode ? "dark-mode" : "light-mode"} text-2xl font-bold mb-4`}>
        Your chat is here
      </div>

      <div className={` scroll-bar ${ Darkmode ? "dark-mode" :"light-mode" } w-full max-w-md h-96 overflow-y-scroll  flex flex-col`}>
        {Messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 mb-2 rounded-lg max-w-[70%] ${
              msg.user === Username
                ? `${Darkmode ? "dark-mode" : "light-mode"} ml-auto bg-blue-500 text-white`
                : `${Darkmode ? "dark-mode" : "light-mode"} bg-gray-300 text-black`
            }`}
          >
            <strong>{msg.user.charAt(0).toUpperCase() + msg.user.slice(1)}: </strong>
            {msg.message}
            <div className="text-xs text-gray-500 mt-1 ">{msg.time}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mt-4 w-full max-w-md">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className={`${Darkmode ? "dark-mode" : "light-mode"} flex-1 p-2 rounded border`}
        />
        <button
          type="submit"
          className={`${Darkmode ? "dark-mode" : "light-mode"} p-2 rounded font-bold`}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbox;

