const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const  Chatbox  = require("./model/chatmodel");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const Db_path='mongodb+srv://acharyaditish:root@cluster0.i2gsqsj.mongodb.net/CHATAPP?retryWrites=true&w=majority&appName=Cluster0'

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
app.get("/api/chats", async (req, res) => {
  try {
    const Msghistory = await Chatbox.find().sort({ createdAt:-1 }).limit(50)
    res.json(Msghistory.reverse());
  } catch (error) {
    res.status(500).json({error:"failed to feteched the chathistory"})
  }
})



io.on("connection",  async (socket) => {
  console.log("User connected:", socket.id);

  socket.emit("message", "Hello from server");

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  }); 
  socket.on("send-message", async (msg) => {
  const savedMessage = new Chatbox(msg);
    await savedMessage.save();
    io.emit("received-message", savedMessage);
  });
  socket.on("deleted-msg", async (id) => {
    const deletemsg = await Chatbox.findByIdAndDelete(id);
    io.emit("msg-deleted", id);
  })
  socket.on("edit-msg", async ({ id, newText }) => {
    const updatedmsg = await Chatbox.findByIdAndUpdate(
      id,
      {
        message: newText,
        edited:true
      },
      {new:true}
    )
    io.emit("message_updated", updatedmsg);
  })
    
  })
 


app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 5000;

mongoose.connect(Db_path).then(() => {
  console.log("conneted to the mongoose")
  server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
 
}).catch(err => {
  console.log("error while connecting mongose", err)
})
