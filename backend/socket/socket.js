import { Server } from "socket.io";

export const setupSocket = (server) => {
    const io = new Server(2000, {
        cors: {
            origin: "http://localhost:5173", 
            methods: ["GET", "POST"]
        }
    });

    const onlineUsers = {};

    io.on("connection", (socket) => {
        const username = socket.handshake.query.username; 
        socket.username = username;
        onlineUsers[username] = socket.id;

        console.log(` ${username} connected. Socket ID: ${socket.id}`);

        io.emit("userOnline", { username });

        socket.on("joinRoom", ({ user1, user2 }) => {
            const roomName = [user1, user2].sort().join("_"); 
            socket.join(roomName);
            console.log(` ${username} joined room: ${roomName}`);
        });

        socket.on("sendMessage", ({ sender, receiver, message }) => {
            const roomName = [sender, receiver].sort().join("_"); 
            io.to(roomName).emit("receiveMessage", { sender, message }); 
            console.log(` ${sender} -> ${receiver}: ${message}`);
        });

        socket.on("disconnect", () => {
            console.log(` ${username} disconnected`);
            delete onlineUsers[username]; 
            io.emit("userOffline", { username }); 
        });
    });
}