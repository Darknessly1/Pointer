import { useEffect, useState } from "react";
import socket from "../../utils/socket";
import axios from "axios";

const Chat = ({ user, receiverId }) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetchMessages();

        socket.on("receiveMessage", (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [receiverId]);

    const fetchMessages = async () => {
        try {
            const { data } = await axios.get("http://localhost:9000/api/chat/messages", {
                params: { senderId: user._id, receiverId },
            });
            setMessages(data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const sendMessage = async () => {
        if (!message.trim()) return;

        const newMessage = { senderId: user._id, receiverId, message };

        socket.emit("sendMessage", newMessage);

        try {
            await axios.post("http://localhost:9000/api/chat/send", newMessage);
            setMessages((prev) => [...prev, newMessage]);
            setMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <p key={index} style={{ textAlign: msg.senderId === user._id ? "right" : "left" }}>
                        {msg.message}
                    </p>
                ))}
            </div>
            <input  
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
