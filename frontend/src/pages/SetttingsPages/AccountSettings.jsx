import { Upload, Save, Sun, Moon } from "lucide-react";

const AccountSettings = ({
    userData,
    previewImage,
    darkMode,
    setDarkMode,
    handleInputChange,
    handleImageUpload,
    triggerFileInput,
    fileInputRef,
    fetchUserData,
    handleSaveChanges,
    isSaving,
}) => {
    return (
        <div
            className={`flex-grow w-full border-2 border-blue-600 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg overflow-hidden`}
        >
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
                                className="absolute inset-0 w-30 h-30 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200"
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
                            <h3 className="text-xl font-bold">{userData.fullName}</h3>
                            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{userData.email}</p>
                            <button
                                onClick={triggerFileInput}
                                className="mt-2 text-gray-500 font-bold hover:text-gray-900 text-sm "
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
    )
}

export default AccountSettings