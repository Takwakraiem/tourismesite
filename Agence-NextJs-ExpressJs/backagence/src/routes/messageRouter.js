const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const { protectSocket } = require("../middlewares/socketAuth"); 
const authMiddleware = require('../middlewares/authMiddleware');
router.post("/messages", protectSocket, messageController.sendMessage);
router.get("/messages/:userId", authMiddleware, messageController.getMessagesByUser);
//router.get("/messages/:toUserId", authMiddleware, messageController.getMessages);
router.patch("/messages/read/:id", protectSocket, messageController.markAsRead);

module.exports = router;
