/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';

const Mainmenu = ({ setPopupVisible }) => {
    const [users, setUsers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [teamName, setTeamName] = useState('');
    const [teamLeader, setTeamLeader] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Fetch all users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/api/users');

                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }

                const data = await response.json();
                setUsers(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Handle member selection
    const toggleMemberSelection = (userId) => {
        if (selectedMembers.includes(userId)) {
            setSelectedMembers(selectedMembers.filter(id => id !== userId));
        } else {
            setSelectedMembers([...selectedMembers, userId]);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!teamName || !teamLeader || selectedMembers.length === 0) {
            setError('Please fill in all fields and select at least one team member');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/teams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    teamsName: teamName,
                    teamsLeadersName: teamLeader,
                    members: JSON.stringify(selectedMembers)
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create team');
            }

            const data = await response.json();
            setSuccess('Team created successfully!');
            setTeamName('');
            setTeamLeader('');
            setSelectedMembers([]);

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess(null);
            }, 3000);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-50">
            {/* Pop-up content */}
            <div className="z-10 bg-white  shadow-2xl p-6 max-w-4xl mx-auto w-full  border-2 border-black rounded-3xl">
                <div className='grid grid-cols-2'>
                    <h1 className="text-2xl font-bold mb-6">Create New Team</h1>
                    <div className='flex content-center justify-end pb-10'>
                        <button
                            onClick={() => setPopupVisible(false)}
                            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-300 to-red-900 text-white font-medium text-lg hover:rounded-3xl rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 ease-in-out hover:from-blue-gray-300 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50"
                        >
                            Close
                        </button>
                    </div>
                </div>
                {/* Error and success messages */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {success}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Team Name</label>
                        <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            placeholder="Enter team name"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Team Leader</label>
                        <select
                            value={teamLeader}
                            onChange={(e) => setTeamLeader(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        >
                            <option value="">Select a team leader</option>
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.fullName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Team Members</label>
                        {loading ? (
                            <p>Loading users...</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {users.map((user) => (
                                    <div
                                        key={user._id}
                                        className={`p-4 border rounded cursor-pointer ${selectedMembers.includes(user._id)
                                            ? 'bg-blue-100 border-blue-500'
                                            : 'bg-white border-gray-300'
                                            }`}
                                        onClick={() => toggleMemberSelection(user._id)}
                                    >
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                                                {user.profilePic ? (
                                                    <img
                                                        src={user.profilePic}
                                                        alt={user.fullName}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-lg font-bold text-gray-600">
                                                        {user.fullName.charAt(0)}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-medium">{user.fullName}</h3>
                                                <p className="text-sm text-gray-500">@{user.userName}</p>
                                            </div>
                                            <div className="ml-auto">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMembers.includes(user._id)}
                                                    onChange={() => { }}
                                                    className="h-5 w-5"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Selected {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white font-medium text-lg hover:rounded-3xl rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 ease-in-out hover:from-blue-gray-700 hover:to-blue-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50"
                        >
                            Create Team
                        </button>
                    </div>
                </form>

                {/* Close button */}

            </div>
        </div>
    );
};

export default Mainmenu;