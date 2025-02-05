import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    dateStart: { type: String, required: true },
    dateEnd: { type: String, required: true },
    timeStart: { type: String, required: true }, 
    timeEnd: { type: String, required: true }, 
    priority: { type: String, required: true, enum: ["high", "normal", "low"] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);
export default Schedule;