import mongoose from "mongoose";

const teamScheduleSchema = new mongoose.Schema({
    teamsName: { type: String, required: true },
    teamsLeadersName: { type: String, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
}, { timestamps: true });

const TeamSchedule = mongoose.model("TeamSchedule", teamScheduleSchema);
export default TeamSchedule;
