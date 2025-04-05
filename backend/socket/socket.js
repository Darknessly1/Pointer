import { Server } from "socket.io";
import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";

const onlineUsers = new Map();

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        },
        transports: ["websocket", "polling"],
    });

    io.on("connection", async (socket) => {
        const userId = socket.handshake.query.userId;
        if (!userId || userId === "null" || !userId.match(/^[0-9a-fA-F]{24}$/)) {
            console.log("❌ Invalid user ID, disconnecting...");
            return socket.disconnect();
        }

        const user = await User.findById(userId);
        if (!user) return socket.disconnect();

        if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
        onlineUsers.get(userId).add(socket.id);

        console.log(`User connected: ${user.userName} (Socket ID: ${socket.id})`);

        io.emit("userOnline", userId);

        socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
            if (!senderId || !receiverId || !message.trim()) return;

            const chatMessage = new Chat({ senderId, receiverId, message });
            await chatMessage.save();

            const messageData = {
                _id: chatMessage._id,
                senderId,
                receiverId,
                message,
                timestamp: chatMessage.createdAt,
            };

            if (onlineUsers.has(receiverId)) {
                onlineUsers.get(receiverId).forEach(socketId => {
                    io.to(socketId).emit("receiveMessage", messageData);
                });
            }

            // Send message back to sender too
            socket.emit("receiveMessage", messageData);
        });

        socket.on("disconnect", () => {
            onlineUsers.get(userId)?.delete(socket.id);
            if (onlineUsers.get(userId)?.size === 0) {
                onlineUsers.delete(userId);
                io.emit("userOffline", userId);
            }
            console.log(`User disconnected: ${user.userName}`);
        });
    });

    return io;
};

export { setupSocket };
