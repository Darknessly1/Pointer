import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login: contextLogin } = useAuthContext();

    const login = async (userName, password) => {
        const isValid = handleInputErrors(userName, password);
        if (!isValid) return;

        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userName, password }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Invalid username or password.");
            }

            contextLogin(data);
            localStorage.setItem('authToken', data.token);


            toast.success("Login successful!");
            navigate("/");
        } catch (error) {
            toast.error(error.message || "An error occurred during login.");
        } finally {
            setLoading(false);
        }
    };

    return { loading, login };
};

export default useLogin;

function handleInputErrors(userName, password) {
    if (!userName || !password) {
        toast.error("Please fill in all fields");
        return false;
    }
    return true;
}
