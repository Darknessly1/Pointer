import User from '../models/user.model.js';

// Fetch current user (for settings page)
export const fetchCurrentUser = async (req, res) => {
    try {
        const userId = req.user?.id; // Use req.user.id instead of req.userId

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized. User not logged in.' });
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({
            fullName: user.fullName,
            userName: user.userName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            gender: user.gender,
            profilePic: user.profilePic || ""
        });

    } catch (error) {
        console.error('Error fetching current user:', error.message);
        res.status(500).json({ message: 'Failed to fetch user data.' });
    }
};

// Update current user (for saving settings)
export const updateCurrentUser = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized. User not logged in.' });
        }

        const { fullName, email, phoneNumber, gender } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { fullName, email, phoneNumber, gender },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({ message: 'Failed to update user data.' });
    }
};

// For profile picture upload
export const uploadProfilePicture = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized. User not logged in.' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const profilePicPath = req.file.path; // Or however you access the uploaded file

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: profilePicPath },
            { new: true }
        );

        res.status(200).json({
            message: 'Profile picture uploaded successfully',
            profilePic: profilePicPath
        });
    } catch (error) {
        console.error('Error uploading profile picture:', error.message);
        res.status(500).json({ message: 'Failed to upload profile picture.' });
    }
};