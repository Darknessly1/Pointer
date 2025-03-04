import { useState, useEffect, useContext } from 'react';
import Calendar from './Calendar';
import { AuthContext } from '../../context/AuthContext';
import Addtasks from '../../components/Addtasks';

const Schedulestable = () => {
    const [tasks, setTasks] = useState([]);
    const { authUser } = useContext(AuthContext);
    const [selectedTask, setSelectedTask] = useState(null);
    const [openAddTaskSection, setOpenAddTaskSection] = useState(false);
    const [inputs, setInputs] = useState({
        title: '',
        dateStart: '',
        dateEnd: '',
        timeStart: '',
        timeEnd: '',
        priority: ''
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setInputs({ ...inputs, [id]: value });
    };

    const addTask = async () => {
        const { title, dateStart, dateEnd, priority, timeStart, timeEnd } = inputs;

        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("Token is missing or invalid");
            return;
        }

        if (!authUser) {
            console.error("authUser  is missing");
            return;
        }

        if (!title || !dateStart || !dateEnd) {
            alert("Title and Dates are required");
            return;
        }

        const startDate = new Date(`${dateStart}T${timeStart}`);
        const endDate = new Date(`${dateEnd}T${timeEnd}`);

        const [startHours, startMinutes] = timeStart.split(":").map(Number);
        startDate.setUTCHours(startHours, startMinutes, 0, 0);

        const [hours, minutes] = timeEnd.split(":").map(Number);
        endDate.setUTCHours(hours, minutes, 0, 0);

        if (endDate < startDate) {
            alert("End date cannot be earlier than start date.");
            return;
        }

        const formatTime = (time) => {
            if (!time.includes(":")) return "00:00";
            return time.length === 5 ? time : `${time}:00`;
        };

        const newTask = {
            title,
            dateStart: startDate.toISOString(),
            dateEnd: endDate.toISOString(),
            timeStart: formatTime(timeStart),
            timeEnd: formatTime(timeEnd),
            priority,
            backgroundColor: getBackgroundColor(priority),
        };

        try {
            const res = await fetch("http://localhost:9000/api/schedule/addSchedule", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newTask),
            });

            if (res.ok) {
                setInputs({ title: '', dateStart: '', dateEnd: '', priority: '', timeStart: '', timeEnd: '' });
                fetchTasks();
            } else {
                const error = await res.json();
                console.error("Error adding task:", error);
            }
        } catch (error) {
            console.error("Error adding task:", error.message);
        }
    };

    const updateTask = async () => {
        try {
            const { id, title, dateStart, dateEnd, priority, timeStart, timeEnd } = selectedTask;

            const startDate = new Date(`${dateStart}T${timeStart}`);
            const endDate = new Date(`${dateEnd}T${timeEnd}`);

            const [startHours, startMinutes] = timeStart.split(":").map(Number);
            startDate.setUTCHours(startHours, startMinutes, 0, 0);

            const [hours, minutes] = timeEnd.split(":").map(Number);
            endDate.setUTCHours(hours, minutes, 0, 0);

            if (endDate < startDate) {
                alert("End date/time cannot be earlier than start date/time.");
                return;
            }

            const formatTime = (time) => {
                if (!time.includes(":")) return "00:00";
                return time.length === 5 ? time : `${time}:00`;
            };

            const updatedTask = {
                title,
                dateStart: startDate.toISOString(),
                dateEnd: endDate.toISOString(),
                timeStart: formatTime(timeStart),
                timeEnd: formatTime(timeEnd),
                priority
            };

            const res = await fetch(`http://localhost:9000/api/schedule/updateSchedule/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTask),
            });

            if (res.ok) {
                await fetchTasks();
                setSelectedTask(null);
            } else {
                const error = await res.json();
                console.error("Error updating task:", error);
            }
        } catch (error) {
            console.error("Error updating task:", error.message);
        }
    };

    const removeTask = async (taskId) => {
        try {
            const response = await fetch(`http://localhost:9000/api/schedule/deleteSchedule/${taskId}`, {
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
        if (!authUser || !authUser.token) {
            console.error("authUser  or token is missing");
            return;
        }

        try {
            const res = await fetch('http://localhost:9000/api/schedule/showSchedule', {
                headers: {
                    Authorization: `Bearer ${authUser.token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch tasks");
            }

            const data = await res.json();

            const formattedTasks = data.map((task) => ({
                id: task._id,
                title: task.title,
                start: task.dateStart,
                end: task.dateEnd,
                timeStart: task.timeStart,
                timeEnd: task.timeEnd,
                priority: task.priority,
                backgroundColor: getBackgroundColor(task.priority),
            }));

            setTasks(formattedTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [authUser]);

    const handleEventClick = (clickInfo) => {
        const { id, title, start, end, timeStart, timeEnd, priority } = clickInfo;
        setSelectedTask({
            id,
            title,
            dateStart: new Date(start).toISOString().split('T')[0],
            dateEnd: new Date(end).toISOString().split('T')[0],
            timeStart,
            timeEnd,
            priority
        });
    };

    const getBackgroundColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'red';
            case 'normal':
                return 'blue';
            case 'low':
                return 'green';
            default:
                return 'gray';
        }
    };

    const handleEventDrop = async (eventDropInfo) => {
        if (!eventDropInfo.event) {
            console.error("Event is undefined");
            return;
        }

        const { id, title } = eventDropInfo.event;
        const start = eventDropInfo.event.start;
        const end = eventDropInfo.event.end;

        if (!start || !end) {
            console.error("Invalid start or end date:", { start, end });
            return;
        }

        const newDateStart = start.toISOString();
        const newDateEnd = end.toISOString();

        try {
            const res = await fetch(`http://localhost:9000/api/schedule/updateSchedule/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    dateStart: newDateStart,
                    dateEnd: newDateEnd,
                }),
            });

            if (res.ok) {

                const updatedTask = await res.json();

                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task.id === id
                            ? { ...task, start: updatedTask.dateStart, end: updatedTask.dateEnd }
                            : task
                    )
                );
            } else {
                const error = await res.json();
                console.error("Error updating task:", error);
            }
        } catch (error) {
            console.error("Error during event drop:", error);
        }
    };

    const handleModalClose = () => {
        setSelectedTask(null);
    };

    const handleOpenAddTaskSection = () => {
        setInputs({
            title: '',
            dateStart: '',
            dateEnd: '',
            timeStart: '',
            timeEnd: '',
            priority: ''
        });
        setOpenAddTaskSection(true);
    };

    return (
        <>
            <div className="flex justify-center">
                <a
                    href='/teamsDashboard'
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white font-medium text-lg rounded-lg hover:rounded-3xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 ease-in-out hover:from-blue-gray-300 hover:to-blue-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50"
                >
                    <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        ></path>
                    </svg>
                    Switch To Team Schedule
                </a>
            </div >
            <div className="min-h-screen bg-gradient-to-br flex flex-col items-center p-5">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Personal Schedule</h1>

                <Addtasks
                    setOpenAddTaskSection={setOpenAddTaskSection}
                    openAddTaskSection={openAddTaskSection}
                    inputs={inputs}
                    handleInputChange={handleInputChange}
                    addTask={addTask}
                    handleOpenAddTaskSection={handleOpenAddTaskSection}
                />

                <div className="mt-8 w-full ">
                    <Calendar
                        events={tasks}
                        onEventClick={handleEventClick}
                        onEventDrop={handleEventDrop}
                        userId={authUser.id}
                        setInputs={setInputs}
                        setOpenAddTaskSection={setOpenAddTaskSection}
                        openAddTaskSection={openAddTaskSection}
                        inputs={inputs}
                        handleInputChange={handleInputChange}
                        addTask={addTask}
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
                                <label className="block text-gray-700 font-semibold mb-2">Task Start Time</label>
                                <input
                                    type="time"
                                    value={selectedTask.timeStart}
                                    onChange={(e) => setSelectedTask({ ...selectedTask, timeStart: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Task End Time</label>
                                <input
                                    type="time"
                                    value={selectedTask.timeEnd}
                                    onChange={(e) => setSelectedTask({ ...selectedTask, timeEnd: e.target.value })}
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
        </>
    );
};

export default Schedulestable;