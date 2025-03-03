import TeamSchedule from '../models/team.model.js';

export const getTeam = async (req, res) => {
    try {
        const teams = await TeamSchedule.find();
        res.status(200).json(teams);
    } catch (error) {
        console.error("Error fetching teams:", error);
        res.status(500).json({ message: "Failed to fetch teams" });
    }
};

export const createTeam = async (req, res) => {
    try {
        const { teamsName, teamsLeadersName, members } = req.body;

        // Validate if all required fields are present
        if (!teamsName || !teamsLeadersName || !members) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newTeam = new TeamSchedule({
            teamsName,
            teamsLeadersName,
            members
        });

        const savedTeam = await newTeam.save();
        res.status(201).json(savedTeam);
    } catch (error) {
        console.error("Error creating team:", error);
        res.status(500).json({ message: "Failed to create team" });
    }
}