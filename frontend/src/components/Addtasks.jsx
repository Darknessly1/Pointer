
const Addtasks = ({
    setOpenAddTaskSection,
    openAddTaskSection,
    inputs,
    handleInputChange,
    addTask,
    handleOpenAddTaskSection
}) => {
    return (
        <div>
            <button
                onClick={handleOpenAddTaskSection}
                className="relative px-6 py-3 font-bold text-white transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-gray-400 to-gray-700 rounded-lg hover:rounded-3xl shadow-lg hover:scale-105 hover:shadow-xl backdrop-blur-md hover:backdrop-blur-lg"
            >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent to-purple-700 opacity-30 blur-md rounded-lg"></span>
                <span className="relative z-10">Add Task</span>
            </button>

            {openAddTaskSection && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="relative max-w-2xl bg-white shadow-lg rounded-3xl p-6"
                        style={{ width: '500px' }}
                    >
                        <h1
                            className="text-2xl font-bold text-gray-800 mb-4 text-center"
                        >
                            <span className="border-2 border-black p-2 rounded-lg">
                                Add Task
                            </span>
                        </h1>
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
                            <label className="block text-gray-700 font-semibold mb-2">Start Time</label>
                            <input
                                type="time"
                                id="timeStart"
                                value={inputs.timeStart}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">End Time</label>
                            <input
                                type="time"
                                id="timeEnd"
                                value={inputs.timeEnd}
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
                        <div className="flex justify-center ">
                            <button
                                onClick={() => {
                                    addTask();
                                    setOpenAddTaskSection(false);
                                }}
                                className="border-2 border-black mr-2 w-1/3 bg-gray-200 hover:bg-gray-600 text-black hover:text-white font-semibold py-2 rounded-3xl transition mt-2"
                            >
                                Add Task
                            </button>

                            <button
                                onClick={() => setOpenAddTaskSection(false)}
                                className="border-2 border-black w-1/3 bg-gray-600 text-white hover:text-black font-semibold py-2 rounded-3xl hover:bg-gray-200 transition mt-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Addtasks