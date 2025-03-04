import TeamSchedule from "../models/team.model.js";
import User from "../models/user.model.js";

export const getTeams = async (req, res) => {
    try {
        const userId = req.user.id;
        const teams = await TeamSchedule.find({ createdBy: userId })
            .populate("members", "fullName userName");

        res.status(200).json(teams);
    } catch (error) {
        console.error("Error fetching teams:", error);
        res.status(500).json({ message: "Failed to fetch teams" });
    }
};

export const createTeam = async (req, res) => {
    try {
        console.log("Received request:", req.body);

        const { teamsName, teamsLeadersName, members } = req.body;
        const userId = req.user.id; 

        if (!teamsName || !teamsLeadersName || !members || !Array.isArray(members)) {
            return res.status(400).json({ message: "All fields are required, members must be an array" });
        }

        // Check if all users exist
        const existingUsers = await User.find({ _id: { $in: members } });
        if (existingUsers.length !== members.length) {
            return res.status(400).json({ message: "One or more users do not exist" });
        }

        const newTeam = new TeamSchedule({
            teamsName,
            teamsLeadersName,
            members,
            createdBy: userId
        });

        const savedTeam = await newTeam.save();

        console.log("Team saved:", savedTeam);

        res.status(201).json(savedTeam);
    } catch (error) {
        console.error("Error creating team:", error);
        res.status(500).json({ message: "Failed to create team" });
    }
};
