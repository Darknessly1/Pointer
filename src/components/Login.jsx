// components/Login.js
import { useState } from "react";
import { login } from "../services/authService";
import { Button, Input } from "@material-tailwind/react";


export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [status, setStatus] = useState({ success: null, message: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const credentials = {
            email: formData.email,
            password: formData.password,
        };

        console.log("Logging in with:", credentials); // Debugging line
        try {
            const response = await login(credentials);
            console.log("Login successful:", response.data);
            setStatus({ success: true, message: "Login successful!" });
        } catch (error) {
            console.error("Error during login:", error);
            setStatus({ success: false, message: "Login failed. Please check your credentials." });
        }
    };

    return (
        <div className="flex justify-center items-center ">
            <div className="grid gap-4 w-80">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        label="Email"
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <Button
                        type="submit"
                        color="green"
                    >
                        Login
                    </Button>
                </form>
                {status.message && (
                    <p className={`text-center ${status.success ? "text-green-500" : "text-red-500"}`}>
                        {status.message}
                    </p>
                )}
            </div>
        </div>

    );
}
