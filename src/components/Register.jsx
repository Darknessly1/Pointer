// components/Register.js
import { useState } from "react";
import axios from "axios";
import { Button, Input } from "@material-tailwind/react";

export default function Register() {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

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
        <div className="flex justify-center items-center border-2 border-black p-7 rounded-2xl">
            <div className="grid gap-4 w-80">
                <form onSubmit={handleSubmit}  className="flex flex-col space-y-4">
                    <Input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        label="Username"
                    />
                    <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        label="Email"
                    />
                    <Input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        label="Password"
                    />
                    <Button type="submit" color="green">
                        Register
                    </Button>
                    {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>
            </div>
        </div>
    );
}
