/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";

const ComposeEmail = () => {
    const [recipientUsername, setRecipientUsername] = useState("");
    const [recipientEmail, setRecipientEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [message, setMessage] = useState("");
    const [isExternalEmail, setIsExternalEmail] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.post(
                "http://localhost:9000/api/email/send",
                {
                    recipientUsername: isExternalEmail ? null : recipientUsername,
                    recipientEmail: isExternalEmail ? recipientEmail : null,
                    subject,
                    body,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage(response.data.message);
            setRecipientUsername("");
            setRecipientEmail("");
            setSubject("");
            setBody("");
        } catch (error) {
            setMessage(error.response?.data?.message || "Error sending email.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Compose Email</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Send to:
                    </label>
                    <div className="flex items-center space-x-4">
                        <button
                            type="button"
                            onClick={() => setIsExternalEmail(false)}
                            className={`px-4 py-2 rounded-md ${!isExternalEmail
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                        >
                            User in App
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsExternalEmail(true)}
                            className={`px-4 py-2 rounded-md ${isExternalEmail
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                        >
                            External Email
                        </button>
                    </div>
                </div>
                {!isExternalEmail ? (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Recipient Username:
                        </label>
                        <input
                            type="text"
                            value={recipientUsername}
                            onChange={(e) => setRecipientUsername(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                ) : (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Recipient Email:
                        </label>
                        <input
                            type="email"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Subject:
                    </label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Body:
                    </label>
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        rows="5"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                >
                    Send Email
                </button>
            </form>
            {message && (
                <p
                    className={`mt-4 text-sm ${message === "Email sent successfully."
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                >
                    {message}
                </p>
            )}
        </div>
    );
};

export default ComposeEmail;