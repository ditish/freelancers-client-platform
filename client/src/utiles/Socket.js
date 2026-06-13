import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket", "polling"], // ✅ add this
});

socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.log("❌ Socket error:", err.message);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket disconnected:", reason);
});

export default socket;