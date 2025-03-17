/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef, useContext } from 'react';
import { Bell, Shield, User, CreditCard, Key, Monitor, Moon, Sun, ChevronRight, Save, Upload } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AccountSettings from './SetttingsPages/AccountSettings';
import Privacy from './SetttingsPages/Privacy';
import Inbox from './SetttingsPages/Inbox';

const SettingsPage = () => {
    const { authUser, setAuthUser } = useContext(AuthContext);
    const [darkMode, setDarkMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [userData, setUserData] = useState({
        fullName: '',
        userName: '',
        email: '',
        phoneNumber: '',
        gender: '',
        profilePic: ''
    });
    const [selectedSection, setSelectedSection] = useState("Account");
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        handlePasswordUpdate(currentPassword, newPassword, confirmPassword);
    };

    const handlePasswordUpdate = async (currentPassword, newPassword, confirmPassword) => {
        if (newPassword !== confirmPassword) {
            setMessage("New passwords do not match");
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error("Token is missing or invalid");
                return;
            }
            const response = await axios.put(
                "http://localhost:9000/api/user/update-password",
                { currentPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Check the response message
            if (response.data.message === "Password updated successfully.") {
                setMessage("Password updated successfully");
                // Clear the form fields after successful update
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setMessage("Error updating password");
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage(error.response?.data?.message || "Error updating password");
        }
    };

    const menuItems = [
        { icon: <User size={18} />, label: "Account" },
        { icon: <Bell size={18} />, label: "Inbox" },
        { icon: <Shield size={18} />, label: "Privacy & Security" },
        { icon: <CreditCard size={18} />, label: "Billing" },
        { icon: <Monitor size={18} />, label: "Appearance" },
        { icon: <Key size={18} />, label: "API Keys" },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setIsLoading(true);

            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error("Token is missing or invalid");
                return;
            }

            const response = await axios.get('http://localhost:9000/api/user/fetchCurrentUser', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data) {
                setUserData(response.data);
                setAuthUser(response.data);

                localStorage.setItem("chat-user", JSON.stringify(response.data));
            }

            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setIsLoading(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedImage(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleSaveChanges = async () => {
        try {
            setIsSaving(true);
            const token = localStorage.getItem("authToken");
            if (!token) return console.error("Token missing.");

            let updatedProfilePic = userData.profilePic;

            if (selectedImage) {
                const formData = new FormData();
                formData.append("profilePic", selectedImage);

                const uploadResponse = await axios.put(
                    "http://localhost:9000/api/user/uploadProfilePicture",
                    formData,
                    { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } }
                );

                if (uploadResponse.data.profilePic) {
                    updatedProfilePic = uploadResponse.data.profilePic;
                } else {
                    alert("Failed to upload profile picture.");
                    return;
                }
            }

            const updatedUserData = { ...userData, profilePic: updatedProfilePic };

            const response = await axios.put("http://localhost:9000/api/user/updateCurrentUser", updatedUserData, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                setUserData(response.data.user);
                setAuthUser(response.data.user);
                localStorage.setItem("chat-user", JSON.stringify(response.data.user));
            } else {
                alert("Failed to save changes.");
            }
        } catch (error) {
            console.error("Error saving user data:", error);
            alert("Failed to save changes.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${darkMode ? ' text-white' : ' text-gray-800'}`}>
            <div className="max-w-6xl mx-auto p-6">
                <header className="mb-8 border-2 border-black rounded-3xl p-6 shadow-lg bg-white/70">
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-lg mt-2 opacity-75">Manage your account preferences and settings</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <nav className={`border-2 border-blue-600 rounded-3xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow p-4 h-fit`}>
                        <ul className="space-y-2">
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => setSelectedSection(item.label)}
                                        className={`flex items-center w-full p-3 rounded-lg transition-all
                                    ${selectedSection === item.label
                                                ? darkMode
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-blue-gray-300 text-white"
                                                : darkMode
                                                    ? "hover:bg-gray-700 text-gray-300"
                                                    : "hover:bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        <span className="mr-3">{item.icon}</span>
                                        <span>{item.label}</span>
                                        <ChevronRight size={16} className="ml-auto opacity-50" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div style={{ width: "100%", gridColumn: "span 3" }} >
                        {selectedSection === "Account" &&
                            <AccountSettings
                                userData={userData}
                                setUserData={setUserData}
                                previewImage={previewImage}
                                selectedImage={selectedImage}
                                handleInputChange={handleInputChange}
                                handleImageUpload={handleImageUpload}
                                triggerFileInput={triggerFileInput}
                                darkMode={darkMode}
                                setDarkMode={setDarkMode}
                                fileInputRef={fileInputRef}
                                handleSaveChanges={handleSaveChanges}
                                isSaving={isSaving}
                            />
                        }
                        {selectedSection === "Inbox" && <Inbox />}
                        {selectedSection === "Privacy & Security" &&
                            <Privacy
                                onUpdatePassword={handlePasswordUpdate}
                                message={message}
                                currentPassword={currentPassword}
                                setCurrentPassword={setCurrentPassword}
                                newPassword={newPassword}
                                setNewPassword={setNewPassword}
                                confirmPassword={confirmPassword}
                                setConfirmPassword={setConfirmPassword}
                                handleSubmit={handleSubmit}
                            />
                        }
                        {selectedSection === "Billing" && <div>Billing Settings (Put your content here)</div>}
                        {selectedSection === "Appearance" && <div>Appearance Settings (Put your content here)</div>}
                        {selectedSection === "API Keys" && <div>API Key Management (Put your content here)</div>}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SettingsPage;