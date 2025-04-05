import { io } from "socket.io-client";

const authToken = localStorage.getItem("authToken");
let userId = null;

if (authToken) {
    try {
        const decodedToken = JSON.parse(atob(authToken.split(".")[1]));
        userId = decodedToken.id || null;
    } catch (error) {
        console.error("❌ Error decoding authToken:", error);
    }
}

const socket = io("http://localhost:9000", {
    query: userId ? { userId } : {},
    transports: ["websocket"],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
});

socket.on("connect", () => {
    console.log(`Connected to WebSocket as User ID: ${userId || "Unknown"}`);
});

socket.on("disconnect", (reason) => {
    console.warn(`Disconnected: ${reason}`);
});

export const sendMessage = (receiverId, message) => {
    socket.emit("sendMessage", { senderId: userId, receiverId, message });
};

socket.on("receiveMessage", ({ sender, message }) => {
    console.log(`Message from ${sender}: ${message}`);
});

export default socket;
