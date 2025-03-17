import Chat from "../models/chat.model.js";

export const sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, message } = req.body;

        const chatMessage = new Chat({ senderId, receiverId, message });
        await chatMessage.save();

        res.status(201).json(chatMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Failed to send message" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { senderId, receiverId } = req.query;

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
