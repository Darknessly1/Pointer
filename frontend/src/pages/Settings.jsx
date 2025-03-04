/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef, useContext } from 'react';
import { Bell, Shield, User, CreditCard, Key, Monitor, Moon, Sun, ChevronRight, Save, Upload } from 'lucide-react';
import axios from 'axios'; // Make sure to install axios: npm install axios
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

    // Fetch user data when component mounts
    useEffect(() => {
        fetchUserData();
    }, []);

    // Function to fetch current user data
    const fetchUserData = async () => {
        try {
            setIsLoading(true);

            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error("Token is missing or invalid");
                return;
            }

            if (!authUser) {
                console.error("authUser  is missing");
                return;
            }

            const response = await axios.get('http://localhost:9000/api/user/fetchCurrentUser', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUserData(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setIsLoading(false);
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    // Handle image upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('profilePic', file);

            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error("Token is missing or invalid");
                return;
            }

            const response = await axios.post(
                'http://localhost:9000/api/user/uploadProfilePicture',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.profilePic) {
                const profilePicUrl = `http://localhost:9000/${response.data.profilePic}`;

                setUserData(prev => ({ ...prev, profilePic: profilePicUrl }));
                setAuthUser(prev => ({ ...prev, profilePic: profilePicUrl }));
                localStorage.setItem("chat-user", JSON.stringify({ ...authUser, profilePic: profilePicUrl }));
                alert('Profile picture updated successfully!');
            } else {
                alert('Failed to upload profile picture.');
            }

        } catch (error) {
            console.error('Error uploading profile picture:', error);
            alert('Failed to upload profile picture. Please try again.');
        }
    };


    // Trigger file upload dialog
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    // Handle saving user data
    const handleSaveChanges = async () => {
        try {
            setIsSaving(true);
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error("Token is missing or invalid");
                return;
            }

            const response = await axios.put(
                'http://localhost:9000/api/user/updateCurrentUser',
                userData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                alert('Changes saved successfully!');
                setUserData(response.data.user); // Update local state
                setAuthUser(response.data.user); // Update global state
                localStorage.setItem("chat-user", JSON.stringify(response.data.user)); // Persist changes
            } else {
                alert('Failed to save changes.');
            }
        } catch (error) {
            console.error('Error saving user data:', error);
            alert('Failed to save changes. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };


    // Get first name and last name from fullName for display
    const getNameParts = () => {
        const nameParts = userData.fullName ? userData.fullName.split(' ') : ['', ''];
        return {
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || ''
        };
    };

    // Get initials for the avatar
    const getInitials = () => {
        const { firstName, lastName } = getNameParts();
        return `${firstName.charAt(0) || ''}${lastName.charAt(0) || ''}`;
    };

    if (isLoading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
            <div className="max-w-6xl mx-auto p-6">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-lg mt-2 opacity-75">Manage your account preferences and settings</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Sidebar navigation */}
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

                    {/* Main content */}
                    <div className={`col-span-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg overflow-hidden`}>
                        {/* Section headers with blue accent */}
                        <div className="bg-blue-600 text-white p-4">
                            <h2 className="text-xl font-semibold">Account Settings</h2>
                        </div>

                        {/* Settings content */}
                        <div className="p-6 space-y-8">
                            {/* Profile section with image upload */}
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 relative group">
                                        {userData.profilePic ? (
                                            <img
                                                src={userData.profilePic}
                                                alt="Profile"
                                                className="w-20 h-20 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-violet-500 flex items-center justify-center text-white text-2xl font-bold">
                                                {getInitials()}
                                            </div>
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

                            {/* Appearance section */}
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

                            {/* Action buttons */}
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