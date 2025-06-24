/* eslint-disable no-unused-vars */
// Client-side (e.g., in your React component)
import { useEffect } from "react";
import io from "socket.io-client";
import { jwtDecode } from "jwt-decode";

const authToken = localStorage.getItem("authToken");
let loggedInUserId = null;

if (authToken) {
    try {
        const decoded = jwtDecode(authToken);
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
