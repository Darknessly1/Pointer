import { useState, useEffect } from 'react';
import Calendar from './Calendar';

const Schedulestable = () => {

    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [openAddTaskSection, setOpenAddTaskSection] = useState(false);
    const [inputs, setInputs] = useState({
        title: '',
        dateStart: '',
        dateEnd: '',
        priority: 'normal'
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setInputs({ ...inputs, [id]: value });
    };

    const addTask = async () => {
        const { title, dateStart, dateEnd, priority } = inputs;

        if (!title || !dateStart || !dateEnd) {
            alert("Title and Dates are required");
            return;
        }

        const startDate = new Date(dateStart);
        const endDate = new Date(dateEnd);

        endDate.setHours(23, 59, 59, 999);

        if (endDate < startDate) {
            alert("End date cannot be earlier than start date.");
            return;
        }

        const newTask = { title, dateStart: startDate.toISOString(), dateEnd: endDate.toISOString(), priority };

        try {
            const res = await fetch("http://localhost:5000/api/schedule/addSchedule", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask),
            });

            if (res.ok) {
                console.log("Task added successfully");
                setInputs({ title: '', dateStart: '', dateEnd: '' });
                fetchTasks();
            } else {
                const error = await res.json();
                console.error(error);
            }
        } catch (error) {
            console.error("Something went wrong", error);
        }
    };

    const updateTask = async () => {
        try {
            const { id, title, dateStart, dateEnd, priority } = selectedTask;

            const startDate = new Date(dateStart);
            const endDate = new Date(dateEnd);

            endDate.setHours(23, 59, 59, 999);

            if (endDate < startDate) {
                alert("End date cannot be earlier than start date.");
                return;
            }

            const updatedTask = { title, dateStart: startDate.toISOString(), dateEnd: endDate.toISOString(), priority };

            console.log("Updating Task:", updatedTask);

            const res = await fetch(`http://localhost:5000/api/schedule/updateSchedule/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTask),
            });

            if (res.ok) {
                console.log("Task updated successfully:", await res.json());
                await fetchTasks();
                setSelectedTask(null);
            } else {
                console.error("Error updating task:", await res.json());
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };


    const removeTask = async (taskId) => {
        console.log("Deleting task with ID:", taskId);
        try {
            const response = await fetch(`http://localhost:5000/api/schedule/deleteSchedule/${taskId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log("Task deleted successfully");
                await fetchTasks();
                setSelectedTask(null);
            } else {
                const error = await response.json();
                throw new Error(error.message);
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    const fetchTasks = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/schedule/showSchedule');
            const data = await res.json();
            setTasks(data.map((task) => {
                let backgroundColor = '';

                switch (task.priority) {
                    case 'high':
                        backgroundColor = 'red'; // Red for high priority
                        break;
                    case 'normal':
                        backgroundColor = 'gray'; // Yellow for normal priority
                        break;
                    case 'low':
                        backgroundColor = 'green'; // Green for low priority
                        break;
                    default:
                        backgroundColor = 'blue'; // Default color
                        break;
                }

                return {
                    id: task._id,
                    title: task.title,
                    start: task.dateStart,
                    end: task.dateEnd,
                    backgroundColor: backgroundColor,
                };
            }));
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleEventClick = (clickInfo) => {
        const { id, title, start, end } = clickInfo;
        setSelectedTask({
            id,
            title,
            dateStart: start,
            dateEnd: end,
        });
    };

    const handleEventDrop = async ({ id, title, newDateStart, newDateEnd }) => {
        try {
            const res = await fetch(`http://localhost:5000/api/schedule/updateSchedule/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, dateStart: newDateStart, dateEnd: newDateEnd }),
            });

            if (res.ok) {
                console.log(`Task ${id} successfully updated to ${newDateStart}`);
                await fetchTasks();
            } else {
                const error = await res.json();
                console.error("Error updating task:", error);
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleModalClose = () => {
        setSelectedTask(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br flex flex-col items-center p-5">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Dynamic Schedule System</h1>

            <button
                onClick={() => setOpenAddTaskSection(true)}
                className="relative px-6 py-3 font-bold text-white transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-gray-400 to-gray-700 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl backdrop-blur-md hover:backdrop-blur-lg"
            >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent to-purple-700 opacity-30 blur-md rounded-lg"></span>
                <span className="relative z-10">Add Task</span>
            </button>


            {openAddTaskSection && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="relative w-full max-w-2xl bg-white shadow-lg rounded-3xl p-6">
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Task Name</label>
                            <input
                                id="title"
                                type="text"
                                placeholder="Enter Event Title"
                                value={inputs.title}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Task Start</label>
                            <input
                                id="dateStart"
                                type="date"
                                value={inputs.dateStart}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Task End</label>
                            <input
                                id="dateEnd"
                                type="date"
                                value={inputs.dateEnd}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Priority</label>
                            <select
                                id="priority"
                                value={inputs.priority}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">--</option>
                                <option value="high">High</option>
                                <option value="normal">Normal</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                        <button
                            onClick={() => {
                                addTask();
                                setOpenAddTaskSection(false);
                            }}
                            className="w-full bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                            Add Task
                        </button>

                        <button
                            onClick={() => setOpenAddTaskSection(false)}
                            className="w-full bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-400 transition mt-2"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}



            <div className="mt-8 w-full ">
                <Calendar
                    events={tasks}
                    onEventClick={(info) => handleEventClick(info)}
                    onEventDrop={handleEventDrop}
                />
            </div>

            {selectedTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Task</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Task Name</label>
                            <input
                                type="text"
                                value={selectedTask.title}
                                onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Task Start</label>
                            <input
                                type="date"
                                value={selectedTask.dateStart}
                                onChange={(e) => setSelectedTask({ ...selectedTask, dateStart: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Task End</label>
                            <input
                                type="date"
                                value={selectedTask.dateEnd}
                                onChange={(e) => setSelectedTask({ ...selectedTask, dateEnd: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Priority</label>
                            <select
                                value={selectedTask.priority}
                                onChange={(e) => setSelectedTask({ ...selectedTask, priority: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">--</option>
                                <option value="high">High</option>
                                <option value="normal">Normal</option>
                                <option value="low">Low</option>
                            </select>
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={updateTask}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => removeTask(selectedTask.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                            >
                                Delete
                            </button>
                            <button
                                onClick={handleModalClose}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Schedulestable;
