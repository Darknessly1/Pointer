import { useState } from "react";
import { login } from "../services/authService";

export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "", rememberMe: false });
    const [status, setStatus] = useState({ success: null, message: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const credentials = {
            email: formData.email,
            password: formData.password,
            rememberMe: formData.rememberMe, 
        };

        console.log("Logging in with:", credentials);
        try {
            const response = await login(credentials);
            console.log("Login successful:", response.data);
            setStatus({ success: true, message: "Login successful!" });
            if (formData.rememberMe) {
                localStorage.setItem("authToken", response.data.token); 
            }
        } catch (error) {
            console.error("Error during login:", error);
            setStatus({ success: false, message: "Login failed. Please check your credentials." });
        }
    };

    return (
        <div className="flex justify-center items-center">
            <div className="flex justify-center">
                <div className="w-96 backdrop-blur-lg bg-opacity-80 rounded-lg shadow-lg p-5 bg-gray-100 text-black">
                    <h2 className="text-2xl font-bold pb-5">Sign In</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
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
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={formData.rememberMe}
                                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <label htmlFor="rememberMe" className="text-sm">
                                Remember Me
                            </label>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <button
                                type="submit"
                                className="text-white bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5 px-5 w-full sm:w-auto"
                            >
                                Submit
                            </button>
                            <div className="flex items-center text-sm">
                                <p>New here?</p>
                                <a
                                    className="underline cursor-pointer ml-1 text-blue-600"
                                    href="/register"
                                >
                                    Register
                                </a>
                            </div>
                        </div>
                    </form>
                    {status.message && (
                        <p className={`text-center ${status.success ? "text-green-500" : "text-red-500"}`}>
                            {status.message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
