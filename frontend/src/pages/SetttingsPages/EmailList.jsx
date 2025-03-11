/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";

const EmailList = () => {
    const [emails, setEmails] = useState([]);

    const userId = localStorage.getItem("authToken");

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const token = localStorage.getItem("authToken"); 
                const response = await axios.get("http://localhost:9000/api/email/inbox", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setEmails(response.data);
            } catch (error) {
                console.error("Error fetching emails:", error);
            }
        };

        fetchEmails();
    }, [userId]);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Inbox</h2>
            <ul className="space-y-4">
                {emails.map((email) => (
                    <li
                        key={email._id}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-300"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500">
                                    From:{" "}
                                    <span className="font-medium text-gray-800">
                                        {email.sender.userName} ({email.sender.email})
                                    </span>
                                </p>
                                <p className="text-sm text-gray-500">
                                    Subject:{" "}
                                    <span className="font-medium text-gray-800">{email.subject}</span>
                                </p>
                            </div>
                            <small className="text-xs text-gray-400">
                                {new Date(email.timestamp).toLocaleString()}
                            </small>
                        </div>
                        <p className="mt-2 text-sm text-gray-700">{email.body}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EmailList;