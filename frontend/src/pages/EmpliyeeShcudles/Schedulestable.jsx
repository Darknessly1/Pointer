import { useState, useEffect } from 'react';
import Calendar from './Calendar';

const Schedulestable = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [inputs, setInputs] = useState({
        title: '',
        date: ''
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setInputs({ ...inputs, [id]: value });
    };

    const addTask = async () => {
        const { title, date } = inputs;
        if (!title || !date) {
            alert("Title and Date are required");
            return;
        }
        const newTask = { title, date };
        try {
            const res = await fetch("http://localhost:5000/api/schedule/addSchedule", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask),
            });

            if (res.ok) {
                console.log("Task added successfully");
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
        const { id, title, date } = selectedTask;
        try {
            const res = await fetch(`http://localhost:5000/api/schedule/updateSchedule/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, date }),
            });

            if (res.ok) {
                console.log("Task updated successfully");
                await fetchTasks();
                setSelectedTask(null);
            } else {
                const error = await res.json();
                console.error(error);
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
            setTasks(data.map((task) => ({
                id: task._id,
                title: task.title,
                date: new Date(task.date).toISOString().split('T')[0], // Format the date
            })));
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleEventClick = (event) => {
        const { id, title, date } = event;
        const formattedDate = date ? date.split('T')[0] : ''; 
        setSelectedTask({
            id,
            title,
            date: formattedDate
        });
    };


    const handleModalClose = () => {
        setSelectedTask(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br flex flex-col items-center p-5">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Dynamic Schedule System</h1>
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Event Name</label>
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
                    <label className="block text-gray-700 font-semibold mb-2">Event Date</label>
                    <input
                        id="date"
                        type="date"
                        value={inputs.date}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={addTask}
                    className="w-full bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Add Event
                </button>
            </div>
            <div className="mt-8 w-full max-w-4xl">
                <Calendar events={tasks} onEventClick={handleEventClick} />
            </div>

            {selectedTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Task</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Event Name</label>
                            <input
                                type="text"
                                value={selectedTask.title}
                                onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Event Date</label>
                            <input
                                type="date"
                                value={selectedTask.date}
                                onChange={(e) => setSelectedTask({ ...selectedTask, date: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
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
