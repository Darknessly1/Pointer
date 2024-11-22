import { useState } from "react";
import axios from "axios";

export default function Register() {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            setError("Password must be at least 8 characters long, include a number, and a special character.");
            return;
        }

        const userData = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
        };

        try {
            const response = await axios.post("http://localhost:4000/api/auth/register", userData);
            setSuccessMessage(response.data.message);
            setError("");
        } catch (error) {
            setError(error.response.data.error || "Error registering user");
            setSuccessMessage("");
        }
    };

    return (
        <div className="flex justify-center items-center">
            <div className="flex justify-center">
                <div className="w-96 backdrop-blur-lg bg-opacity-80 rounded-lg shadow-lg p-5 bg-gray-100 text-black">
                    <h2 className="text-2xl font-bold pb-5">Sign Up</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                        <div className="mb-4">
                            <label htmlFor="username" className="block mb-2 text-sm font-medium">Your Full Name</label>
                            <input
                                id="username"
                                className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full py-2.5 px-4"
                                placeholder="Full Name"
                                required
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium">Your email</label>
                            <input
                                id="email"
                                className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full py-2.5 px-4"
                                placeholder="andrew@mail.com"
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium">Your password</label>
                            <input
                                id="password"
                                className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full py-2.5 px-4"
                                placeholder="*********"
                                required
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <button
                                type="submit"
                                className="rounded-3xl bg-blue-gray-400 hover:bg-blue-gray-700 text-white font-bold py-3 px-5 text-lg"
                            >
                                Register
                            </button>
                            <div className="flex items-center text-sm">
                                <p>Have an account?</p>
                                <a
                                    className="underline cursor-pointer ml-1 text-blue-600"
                                    href="/login"
                                >
                                    Login
                                </a>
                            </div>
                        </div>
                    </form>
                    {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
                    {error && (
                        <p className="text-red-500 text-sm font-medium mt-2">
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
