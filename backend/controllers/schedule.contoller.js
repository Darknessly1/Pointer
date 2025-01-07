import Schedule from "../models/schedule.model.js"

export const showSchedule = async (req, res) => {
    try {
        const schedules = await Schedule.find();
        res.status(200).json(schedules);
    } catch (error) {
        console.error("Error fetching schudles: ", error.message);
        res.status(500).json({ message: "Failed to fetch Events" });
    }
}


export const addSchedule = async (req, res) => {
    let { title, date } = req.body;
    if (!title || !date) {
        return res.status(400).json({ message: "Title or Date should be provided" });
    }
    try {
        const newTask = new Schedule({
            title,
            date
        })
        await newTask.save();
        res.status(201).json({ message: "Task added successfully" });

    } catch (error) {
        console.error("Error to adding event", error.message);
        res.status(500).json({ message: "Failed to add Event " });
    }
}


export const updateSchedule = async (req, res) => {
    try {
        const { id } = req.params; 
        const { title, date } = req.body;

        if (!title || !date) {
            return res.status(400).json({ message: "Task title and date are required" });
        }

        const updatedTask = await Schedule.findByIdAndUpdate(
            id, 
            { title, date }, 
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found." });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Failed to update task", error: error.message });
    }
};

export const deleteSchedule = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Task ID is required" });
        }

        const task = await Schedule.findByIdAndDelete(id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully", task });
    } catch (error) {
        console.error("Error deleting task:", error.message);
        res.status(500).json({
            message: "Failed to delete task",
            error: error.message,
        });
    }
};

