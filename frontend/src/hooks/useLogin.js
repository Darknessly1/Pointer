import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Allows redirection to the homepage

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
            console.log(res);


            // Save user data in localStorage
            localStorage.setItem("chat-user", JSON.stringify(data));

            toast.success("Login successful!");

            // Redirect to the homepage
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
