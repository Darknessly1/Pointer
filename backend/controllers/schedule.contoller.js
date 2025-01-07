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
    const { title, dateStart, dateEnd } = req.body;
    try {
        const newTask = new Schedule({ title, dateStart, dateEnd });
        await newTask.save();
        res.status(200).json(newTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const updateSchedule = async (req, res) => {
    const { title, dateStart, dateEnd } = req.body;
    try {
        const updatedTask = await Schedule.findByIdAndUpdate(
            req.params.id,
            { title, dateStart, dateEnd },
            { new: true }
        );
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
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

