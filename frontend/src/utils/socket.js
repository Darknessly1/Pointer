import { io } from "socket.io-client";

const username = localStorage.getItem("authToken");

const socket = io("ws://localhost:9000", {
    query: { username } 
});

socket.on("connect", () => {
    console.log(` Connected to WebSocket as: ${username}`);
});

export const joinRoom = (user1, user2) => {
    socket.emit("joinRoom", { user1, user2 });
};

export const sendMessage = (receiver, message) => {
    socket.emit("sendMessage", { sender: username, receiver, message });
};

socket.on("receiveMessage", ({ sender, message }) => {
    console.log(`Message from ${sender}: ${message}`);
});

export default socket;
