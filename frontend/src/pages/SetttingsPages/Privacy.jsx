const Privacy = ({
    message,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    handleSubmit,
}) => {

    const getMessageColor = () => {
        if (message === "Password updated successfully.") {
            return "text-green-500"; // Green for success
        } else if (message === "Current password is incorrect.") {
            return "text-red-500"; // Red for incorrect password
        } else if (message === "New passwords do not match.") {
            return "text-gray-500"; // Gray for mismatched passwords
        }
        return "text-gray-500"; // Default color
    };

    return (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Update Password</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Current Password:
                    </label>
                    <input
                        type="password"
                        className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        New Password:
                    </label>
                    <input
                        type="password"
                        className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Confirm New Password:
                    </label>
                    <input
                        type="password"
                        className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
                >
                    Update Password
                </button>
            </form>
            {message && (
                <p className={`mt-2 text-sm ${getMessageColor()}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default Privacy;