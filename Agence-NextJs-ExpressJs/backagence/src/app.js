const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const db = require("./config/db")
const { protectSocket } = require("./middlewares/socketAuth");
const http = require("http");
const { Server } = require("socket.io");
dotenv.config();
const cors = require('cors');
const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // à restreindre si besoin
    methods: ["GET", "POST"],
  },
});
app.use(bodyParser.json());
app.use(cors({
  origin: "http://localhost:3000",
}))
app.use('/api/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Lire toutes les routes depuis le dossier 'routes'
const fs = require('fs');
const { Message } = require('./models/Message');
const routesDir = path.join(__dirname, 'routes');
fs.readdirSync(routesDir).forEach(file => {
    const routePath = path.join(routesDir, file);
    const route = require(routePath); 
    app.use('/api', route); // Toutes les routes seront précédées de /api
});
io.use(protectSocket);
io.on("connection", (socket) => {
  const userId = socket.user.id;

  console.log(`Utilisateur connecté : ${userId}`);
  socket.join(userId); 
  socket.on("sendMessage", async (data) => {
    const { content, toUserId } = data;

    const newMessage = new Message({
      content,
      sender: userId,
      userId: toUserId,
    });
  await newMessage.save();
    io.to(toUserId).emit("newMessage", newMessage);
    io.to(userId).emit("messageSent", newMessage);
  });

  socket.on("disconnect", () => {
    console.log(`Utilisateur déconnecté : ${userId}`);
  });
});
module.exports = server;
