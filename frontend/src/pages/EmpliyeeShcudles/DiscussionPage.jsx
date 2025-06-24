/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
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
    const messagesContainerRef = useRef(null);
    const [unreadCounts, setUnreadCounts] = useState({});
    const [isTyping, setIsTyping] = useState(false);
    const [typingUsers, setTypingUsers] = useState({});
    const typingTimeoutRef = useRef(null);
    const [typingStatus, setTypingStatus] = useState(false);



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
        setUnreadCounts(prev => ({ ...prev, [user._id]: 0 }));
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

        // setMessages((prevMessages) => [...prevMessages, newMessage]);
        setTimeout(scrollToBottomIfNeeded, 100);

        socket.emit("sendMessage", newMessage);

        setMessage("");
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

    useEffect(() => {
        const handleMessageReceive = (newMessage) => {
            const isCurrentChatOpen =
                (newMessage.senderId === selectedUser?._id || newMessage.receiverId === selectedUser?._id);

            if (isCurrentChatOpen) {
                setMessages(prev => [...prev, newMessage]);
            } else {
                setUnreadCounts(prev => ({
                    ...prev,
                    [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
                }));
            }
        };

        socket.on("receiveMessage", handleMessageReceive);
        return () => socket.off("receiveMessage", handleMessageReceive);
    }, [selectedUser]);

    // const handleTyping = () => {
    //     socket.emit('typing', { senderId: loggedInUserId, receiverId: selectedUser._id });
    // };

    const handleTyping = () => {
        if (!selectedUser || !loggedInUserId) return;

        if (!isTyping) {
            socket.emit("typing", {
                senderId: loggedInUserId,
                receiverId: selectedUser._id,
            });
            setIsTyping(true);
        }

        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stopTyping", {
                senderId: loggedInUserId,
                receiverId: selectedUser._id,
            });
            setIsTyping(false);
        }, 1500); // stays active while you're typing, resets 1.5s after stop
    };

    useEffect(() => {
        socket.on("typing", ({ senderId }) => {
            if (selectedUser && selectedUser._id === senderId) {
                setTypingStatus(true);
            }
        });

        socket.on("stopTyping", ({ senderId }) => {
            if (selectedUser && selectedUser._id === senderId) {
                setTypingStatus(false);
            }
        });

        return () => {
            socket.off("typing");
            socket.off("stopTyping");
        };
    }, [selectedUser]);


    useEffect(() => {
        const handleTyping = ({ senderId, receiverId }) => {
            if (receiverId === loggedInUserId) {
                setTypingUsers(prev => ({
                    ...prev,
                    [senderId]: true
                }));

                setTimeout(() => {
                    setTypingUsers(prev => ({
                        ...prev,
                        [senderId]: false
                    }));
                }, 3000);
            }
        };

        socket.on("typing", handleTyping);
        return () => socket.off("typing", handleTyping);
    }, []);


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
                            <div key={user._id}>
                                {user.fullName} {unreadCounts[user._id] > 0 && <span>({unreadCounts[user._id]})</span>}
                            </div>
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
                                onChange={(e) => {
                                    setMessage(e.target.value);
                                    handleTyping();
                                    if (selectedUser?._id && loggedInUserId) {
                                        socket.emit("typing", {
                                            senderId: loggedInUserId,
                                            receiverId: selectedUser._id,
                                        });
                                    }
                                }}
                                className="w-full py-2 px-4 border rounded-md"
                            />
                            {/* {selectedUser && typingUsers[selectedUser._id] && (
                                <div className="text-sm italic text-gray-500 mb-2">
                                    {selectedUser.fullName || selectedUser.username} is typing...
                                </div>
                            )} */}

                            {typingStatus && (
                                <p className="text-sm text-gray-400 italic mt-1">{selectedUser.fullName || "User"} is typing...</p>
                            )}
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