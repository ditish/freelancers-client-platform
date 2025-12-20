import { useEffect } from "react";
import socket from "./socket";

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("message", (data) => {
      console.log("Message from server:", data);
    });

    return () => {
      socket.off("connect");
      socket.off("message");
    };
  }, []);

  return <h1 className=" text-red-400">React + Socket.IO</h1>;
}

export default App;
