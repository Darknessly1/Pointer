/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


const authToken = localStorage.getItem("authToken");
let loggedInUserId = null;

if (authToken) {
    try {
        const decoded = jwtDecode(authToken);
        console.log(decoded);
        loggedInUserId = decoded.userId || decoded.id || decoded._id;
    } catch (err) {
        console.error("Failed to decode token:", err);
    }
}
const socket = io("http://localhost:9000", {
    withCredentials: true,
    transports: ["websocket", "polling"],
    query: authToken ? { authToken } : {},
});

const DiscussionPage = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    // const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);


    useEffect(() => {
        scrollToBottomIfNeeded();
    }, [messages]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:9000/api/user/users", {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setUsers(response.data.filter(user => user._id !== loggedInUserId));
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, [loggedInUserId]);

    useEffect(() => {
        const handleMessageReceive = (newMessage) => {
            if (
                (newMessage.senderId === loggedInUserId && newMessage.receiverId === selectedUser?._id) ||
                (newMessage.receiverId === loggedInUserId && newMessage.senderId === selectedUser?._id)
            ) {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
        };

        socket.on("receiveMessage", handleMessageReceive);

        return () => {
            socket.off("receiveMessage", handleMessageReceive);
        };
    }, [selectedUser]);

    const fetchMessages = async (user) => {
        if (!user?._id || !loggedInUserId) {
            console.error("Error: senderId or receiverId is missing", {
                senderId: loggedInUserId,
                receiverId: user?._id
            });
            return;
        }

        try {
            const response = await axios.get("http://localhost:9000/api/chat/messages", {
                params: { senderId: loggedInUserId, receiverId: user._id },
                headers: { Authorization: `Bearer ${authToken}` },
            });

            if (response.status === 200) {
                setMessages(response.data);
            } else {
                console.error("Unexpected response:", response);
            }
        } catch (error) {
            console.error("Error fetching messages:", error.response?.data || error.message);
        }
    };


    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setMessages([]);
        fetchMessages(user).then(() => {
            scrollToBottomIfNeeded();
        });
    };


    const sendMessage = async () => {
        if (!message.trim() || !selectedUser?._id || !loggedInUserId) {
            console.error("Error: Missing senderId, receiverId, or message", {
                senderId: loggedInUserId,
                receiverId: selectedUser?._id,
                message: message.trim()
            });
            return;
        }

        const newMessage = {
            senderId: loggedInUserId,
            receiverId: selectedUser._id,
            content: message.trim(),
            timestamp: new Date(),
        };

        socket.emit("sendMessage", newMessage);
        setMessage("");

        // try {
        //     const response = await axios.post("http://localhost:9000/api/chat/send", newMessage, {
        //         headers: { Authorization: `Bearer ${authToken}` },
        //     });

        //     if (response.status === 200 || response.status === 201) {
        //         const savedMessage = response.data;

        //         socket.emit("sendMessage", savedMessage);

        //         // setMessages((prevMessages) => [...prevMessages, savedMessage]);
        //         // setMessages();
        //         setMessage("");
        //     } else {
        //         console.error("Unexpected response:", response);
        //     }
        // } catch (error) {
        //     console.error("Error sending message:", error.response?.data || error.message);
        // }
    };

    const scrollToBottomIfNeeded = () => {
        const container = messagesContainerRef.current;
        if (container) {
            const isOverflowing = container.scrollHeight > container.clientHeight;
            if (isOverflowing) {
                container.scrollTop = container.scrollHeight;
            }
        }
    };

    return (
        <div className="flex">
            <div className="w-1/4 p-4 border-r bg-gray-50">
                <h3 className="text-xl font-semibold mb-4">Users</h3>
                {users.length === 0 ? (
                    <p>No users found.</p>
                ) : (
                    users.map(user => (
                        <div
                            key={user._id}
                            className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleUserSelect(user)}
                        >
                            {user.fullName || user.username || "Unnamed User"}
                        </div>
                    ))
                )}
            </div>


            <div
                className="w-3/4 p-4 flex flex-col h-[calc(100vh-2rem)]"
            >
                {selectedUser ? (
                    <>
                        <h3 className="text-xl font-semibold mb-4">
                            Chat with {selectedUser.fullName || selectedUser.username}
                        </h3>

                        <div
                            className="flex-1 overflow-y-auto bg-white p-4 border rounded-md"
                            ref={messagesContainerRef}
                        >
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`text-sm mb-2 ${msg.senderId === loggedInUserId ? "text-right" : "text-left"
                                        } text-gray-600`}
                                >
                                    <p
                                        className={`font-semibold ${msg.senderId === loggedInUserId ? "text-blue-600" : "text-green-600"
                                            }`}
                                    >
                                        {msg.senderId === loggedInUserId ? "You" : selectedUser.fullName}:
                                    </p>
                                    <p>{msg.content}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full py-2 px-4 border rounded-md"
                            />
                            <button
                                onClick={sendMessage}
                                className="bg-blue-500 text-white py-2 px-4 rounded-md mt-2 w-full"
                            >
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500">Select a user to start chatting.</p>
                )}
            </div>
        </div>
    );
};

export default DiscussionPage;