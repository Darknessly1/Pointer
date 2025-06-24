import { Server } from "socket.io";
import Chat from "../models/chat.model.js";
import jwt from "jsonwebtoken";


const onlineUsers = new Map();

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        const token = socket.handshake.query.authToken;
        let userId = null;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.userId || decoded.id || decoded._id;
                if (userId) {
                    socket.join(userId);
                    onlineUsers.set(userId, socket.id);
                    console.log(`🔌 User connected: ${userId}`);
                }
            } catch (err) {
                console.error("Socket auth failed:", err.message);
            }
        }

        socket.on("sendMessage", async (data) => {
            const { senderId, receiverId, content } = data;

            if (!senderId || !receiverId || !content?.trim()) return;

            const chatMessage = new Chat({ senderId, receiverId, content });
            await chatMessage.save();

            const messageData = {
                _id: chatMessage._id,
                senderId,
                receiverId,
                content,
                timestamp: chatMessage.createdAt,
            };

            io.to(senderId).emit("receiveMessage", messageData);
            io.to(receiverId).emit("receiveMessage", messageData);
        });

        // socket.on("typing", ({ senderId, receiverId }) => {
        //     const receiverSocketId = onlineUsers.get(receiverId);
        //     if (receiverSocketId) {
        //         io.to(receiverSocketId).emit("typing", {
        //             senderId,
        //             receiverId
        //         });
        //     }
        // });

        socket.on("typing", ({ senderId, receiverId }) => {
            const receiverSocketId = onlineUsers.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("typing", { senderId });
            }
        });

        socket.on("stopTyping", ({ senderId, receiverId }) => {
            const receiverSocketId = onlineUsers.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("stopTyping", { senderId });
            }
        });


        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            if (userId) onlineUsers.delete(userId);
        });
    });


    return io;
};

export { setupSocket };