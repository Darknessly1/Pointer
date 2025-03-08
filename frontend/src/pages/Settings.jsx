/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef, useContext } from 'react';
import { Bell, Shield, User, CreditCard, Key, Monitor, Moon, Sun, ChevronRight, Save, Upload } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

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
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState("");

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
                alert("Changes saved successfully!");
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
                <header className="mb-8">
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-lg mt-2 opacity-75">Manage your account preferences and settings</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <nav className={`rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow p-4 h-fit`}>
                        <ul className="space-y-2">
                            {[
                                { icon: <User size={18} />, label: 'Account' },
                                { icon: <Bell size={18} />, label: 'Notifications' },
                                { icon: <Shield size={18} />, label: 'Privacy & Security' },
                                { icon: <CreditCard size={18} />, label: 'Billing' },
                                { icon: <Monitor size={18} />, label: 'Appearance' },
                                { icon: <Key size={18} />, label: 'API Keys' },
                            ].map((item, index) => (
                                <li key={index}>
                                    <button
                                        className={`flex items-center w-full p-3 rounded-lg ${index === 0 ?
                                            (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600') :
                                            (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
                                    >
                                        <span className="mr-3">{item.icon}</span>
                                        <span>{item.label}</span>
                                        <ChevronRight size={16} className="ml-auto opacity-50" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className={`col-span-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg overflow-hidden`}>
                        <div className="bg-blue-600 text-white p-4">
                            <h2 className="text-xl font-semibold">Account Settings</h2>
                        </div>

                        <div className="p-6 space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 relative group">
                                        {userData.profilePic && (
                                            <img
                                                src={previewImage || userData.profilePic}
                                                alt="Profile"
                                                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                                                onError={(e) => (e.target.src = "http://localhost:9000/uploads/default-profile.png")}
                                            />
                                        )}
                                        <button
                                            onClick={triggerFileInput}
                                            className="absolute inset-0 w-20 h-20 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200"
                                        >
                                            <Upload size={24} className="text-white" />
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </div>
                                    <div className="ml-6">
                                        <h3 className="text-lg font-medium">{userData.fullName}</h3>
                                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{userData.email}</p>
                                        <button
                                            onClick={triggerFileInput}
                                            className="mt-2 text-blue-500 hover:text-blue-600 text-sm font-medium"
                                        >
                                            Change profile picture
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                                            value={userData.fullName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            name="userName"
                                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} bg-gray-100`}
                                            value={userData.userName}
                                            readOnly
                                            disabled
                                        />
                                        <p className="text-xs mt-1 text-gray-500">Username cannot be changed</p>
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                                            value={userData.email}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                                            value={userData.phoneNumber || ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Gender
                                        </label>
                                        <select
                                            name="gender"
                                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                                            value={userData.gender}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <hr className={darkMode ? 'border-gray-700' : 'border-gray-200'} />

                            <div>
                                <h3 className="text-lg font-medium mb-4">Appearance</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Dark Mode</p>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Switch between light and dark themes
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setDarkMode(!darkMode)}
                                        className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-900'}`}
                                    >
                                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 pt-4">
                                <button
                                    onClick={() => fetchUserData()}
                                    className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveChanges}
                                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center"
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} className="mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;