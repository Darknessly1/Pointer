import { Link } from "react-router-dom";
import GenderCheckbox from "./GenderCheckbox";
import { useState } from "react";
import useSignup from "../../hooks/useSignup";

const SignUp = () => {
    const [inputs, setInputs] = useState({
        fullName: '',
        userName: '',
        password: '',
        confirmPassword: '',
        gender: '',
    });

    const { loading, signup } = useSignup();

    const handleCheckboxChange = (gender) => {
        setInputs({ ...inputs, gender });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(inputs);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r ">
            <div className="w-full max-w-xl p-8 bg-white/80 rounded-3xl text-black shadow-md border-2 border-black">
                <h1 className="text-4xl font-bold text-center text-black mb-6">
                    Sign Up
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-black mb-1 font-bold">Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            value={inputs.fullName}
                            onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-black mb-1 font-bold">Username</label>
                        <input
                            type="text"
                            placeholder="johndoe"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            value={inputs.userName}
                            onChange={(e) => setInputs({ ...inputs, userName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-black mb-1 font-bold">Password</label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            value={inputs.password}
                            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-black mb-1 font-bold">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            value={inputs.confirmPassword}
                            onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
                        />
                    </div>
                    <GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />
                    <Link
                        to="/login"
                        className="block text-sm text-teal-500 hover:underline"
                    >
                        Already have an account? Login
                    </Link>
                    <button
                        type="submit"
                        className={`w-full py-2 text-white bg-teal-500 rounded-lg ${loading && "opacity-70 cursor-not-allowed"}`}
                        disabled={loading}
                    >
                        {loading ? <span className="loading loading-spinner">Loading</span> : "Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
