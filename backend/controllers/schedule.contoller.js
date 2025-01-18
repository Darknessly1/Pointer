import Schedule from "../models/schedule.model.js"

export const showSchedule = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "User  not authenticated" });
        }

        const schedules = await Schedule.find({ user: req.user.id }); // Fetch tasks for the authenticated user
        res.status(200).json(schedules);
    } catch (error) {
        console.error("Error fetching schedules:", error.message);
        res.status(500).json({ message: "Failed to fetch schedules" });
    }
};

export const addSchedule = async (req, res) => {
    try {
        console.log("User  ID from request:", req.user.id);
        const { title, dateStart, dateEnd, priority } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "User  not authenticated" });
        }

        const newTask = new Schedule({
            title,
            dateStart,
            dateEnd,
            priority,
            user: req.user.id,
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error("Error adding schedule:", error.message);
        res.status(500).json({ message: "Failed to add schedule" });
    }
};

export const updateSchedule = async (req, res) => {
    const { title, dateStart, dateEnd, priority } = req.body;
    try {
        const updatedTask = await Schedule.findByIdAndUpdate(
            req.params.id,
            { title, dateStart, dateEnd, priority },
            { new: true } 
        );
        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
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


export const showScheduleGroupedByUser = async (req, res) => {
    try {
        const groupedTasks = await Schedule.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails" 
            },
            {
                $group: {
                    _id: "$userDetails._id",
                    fullName: { $first: "$userDetails.fullName" },
                    tasks: {
                        $push: {
                            title: "$title",
                            dateStart: "$dateStart",
                            dateEnd: "$dateEnd",
                            priority: "$priority"
                        }
                    }
                }
            }
        ]);

        res.status(200).json(groupedTasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
