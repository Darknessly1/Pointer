import Chat from "../models/chat.model.js";
import mongoose from "mongoose";

export const sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, content } = req.body;

        if (!senderId || !receiverId || !content || !content.trim()) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newMessage = new Chat({ senderId, receiverId, content: content.trim(), timestamp: new Date() });


        await newMessage.save();

        req.app.get("io").to(receiverId).emit("receiveMessage", newMessage);

        res.status(200).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { senderId, receiverId } = req.query;

        if (!senderId || !receiverId) {
            return res.status(400).json({ message: "Missing senderId or receiverId" });
        }

        if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const messages = await Chat.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId },
            ],
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
};
