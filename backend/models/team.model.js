import mongoose from "mongoose";

const tesmscheduleSchema = new mongoose.Schema({
    teamsName: { type: String, required: true },
    teamsLeadersName: { type: String, required: true },
    members: { type: String, required: true },
});

const TeamSchedule = mongoose.model("TeamSchedule", tesmscheduleSchema);
export default TeamSchedule;