import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }, 
    date: {
        type: String, 
        required: true
    }
})

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;