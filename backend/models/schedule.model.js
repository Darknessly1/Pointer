import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }, 
    dateStart: {
        type: String, 
        required: true
    }, 
    dateEnd: {
        type: String,
        required: true
    }, 
    priority: {
        type: String,
        required: true,
        enum: ["high", "normal", "low"],
    },
    
})

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;