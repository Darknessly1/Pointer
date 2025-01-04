import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";

const Login = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const { loading, login } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(userName, password);
    };

    return (
        <div className="flex items-center justify-center bg-gradient-to-r mt-9">
            <div className="w-full max-w-xl p-8 bg-white/80 rounded-3xl border-2 border-black shadow-md ">
                <h1 className="text-4xl font-bold text-center text-black     mb-6">
                    Login
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-black mb-1 ">Username</label>
                        <input
                            type="text"
                            placeholder="Enter username"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-black mb-1 ">Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Link
                        to="/register"
                        className="block text-sm text-blue-500 hover:underline"
                    >
                        {"Don't"} have an account? Sign up
                    </Link>
                    <button
                        type="submit"
                        className={`w-full py-2 text-white bg-blue-500 rounded-lg ${loading && "opacity-70 cursor-not-allowed"}`}
                        disabled={loading}
                    >
                        {loading ? <span className="loading loading-spinner">Loading</span> : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
