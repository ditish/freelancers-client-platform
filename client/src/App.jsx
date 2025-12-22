import { useEffect } from "react";
import socket from "./socket";
import User from "./Components/User";

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

  return (<>
  
  <User></User></>)
}

export default App;
