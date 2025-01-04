import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useSignup = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const signup = async ({ fullName, userName, password, confirmPassword, gender }) => {
        const success = handleInputError({ fullName, userName, password, confirmPassword, gender });
        if (!success) return;

        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, userName, password, confirmPassword, gender }),
            });
            const data = await res.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // Save user data in local storage
            localStorage.setItem("chat-user", JSON.stringify(data));
            toast.success("Sign-up successful!");
            navigate("/login")
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, signup };
};

export default useSignup;

function handleInputError({ fullName, userName, password, confirmPassword, gender }) {
    if (!fullName || !userName || !password || !confirmPassword || !gender) {
        toast.error("Please fill in all fields");
        return false;
    }

    if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return false;
    }

    if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
    }

    return true;
}
