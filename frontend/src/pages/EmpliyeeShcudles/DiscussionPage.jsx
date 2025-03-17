import { useState, useEffect } from "react";
import Chat from "./Chat";

const DiscussionPage = () => {
    const [showChat, setShowChat] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        console.log("Token:", token);
        if (!token) {
            console.error("Token is missing or invalid");
            return;
        }

        fetch("http://localhost:9000/api/user/fetchCurrentUser", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => setUser(data))
            .catch((error) => console.error("Failed to fetch user:", error));
    }, []);

    const openChat = (userId) => {
        setSelectedUserId(userId);
        setShowChat(true);
    };

    return (
        <div>
            <button onClick={() => openChat("receiver_user_id_here")}>Start Chat</button>

            {showChat && selectedUserId && user && (
                <Chat user={user} receiverId={selectedUserId} />
            )}
        </div>
    );
};

export default DiscussionPage;
