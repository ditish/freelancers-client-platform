const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const { connectedUsers, getConnectedUsers } = require("./socket");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" }
});

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("join", (userId) => {
    connectedUsers[userId] = socket.id;
    console.log("user joined", userId);
  });

   socket.on("join-chat", (conversationId) => {
    socket.join(conversationId);
  });
 

  socket.on("send-message", (message) => {
    io.to(message.conversationId)
      .emit("receive-message", message);
  });


  socket.on("disconnect", () => {
    Object.keys(connectedUsers).forEach(key => {
      if (connectedUsers[key] === socket.id) {
        delete connectedUsers[key];
      }
    });
  });
});

// Routes
app.get("/", (req, res) => res.send("API running"));
app.use("/api", require("./routes/authRoutes"));
app.use("/api", require("./routes/clientRoutes"));
app.use("/api/project", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/invoices", require("./routes/invoiceRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 

module.exports = { app, server, io };
