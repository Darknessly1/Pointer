import User from '../models/user.model.js';
import bcrypt from "bcrypt";

export const fetchCurrentUser = async (req, res) => {
    try {
        const userId = req.user?.id;

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
            profilePic: user.profilePic || "http://localhost:9000/uploads/default-profile.png",
        });

    } catch (error) {
        console.error('Error fetching current user:', error.message);
        res.status(500).json({ message: 'Failed to fetch user data.' });
    }
};

export const updateCurrentUser = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. User not logged in." });
        }

        const { fullName, email, phoneNumber, gender, profilePic } = req.body;

        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                fullName,
                email,
                phoneNumber,
                gender,
                profilePic: profilePic || existingUser.profilePic,
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error.message);
        res.status(500).json({ message: "Failed to update user data." });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. User not logged in." });
        }

        const { currentPassword, newPassword } = req.body;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Verify the current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Current password is incorrect." });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        console.error("Error updating password:", error.message);
        res.status(500).json({ message: "Failed to update password." });
    }
};


export const uploadProfilePicture = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized." });

        if (!req.file) return res.status(400).json({ message: "No file uploaded." });

        const profilePicUrl = `http://localhost:9000/uploads/${req.file.filename}`;

        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: profilePicUrl }, { new: true });

        if (!updatedUser) return res.status(404).json({ message: "User not found." });

        res.status(200).json({ message: "Profile picture uploaded successfully", profilePic: profilePicUrl });
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        res.status(500).json({ message: "Failed to upload profile picture." });
    }
};
