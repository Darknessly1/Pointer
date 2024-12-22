/* eslint-disable no-unused-vars */
import { useState } from "react";

export default function WorkerSearch() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredWorker, setFilteredWorker] = useState(null);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/workers/search-worker?name=${searchTerm}`);
            const data = await response.json();

            if (response.ok) {
                setFilteredWorker(data);
                setError(null);
            } else {
                setFilteredWorker(null);
                setError(data.message || "Worker not found.");
            }
        } catch (err) {
            setFilteredWorker(null);
            setError("An error occurred while searching.", err);
        }
    };


    return (
        <div className="relative mx-auto py-5">
            <div className="flex justify-between items-center">
                <label
                    className="flex content-center justify-center  border py-2 px-2 rounded-full gap-2 shadow-2xl focus-within:border-gray-300"
                    htmlFor="search-bar"
                >
                    <input
                        id="search-bar"
                        placeholder="Enter worker's name"
                        className="px-6 py-2 rounded-md flex-1 outline-none bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        className="rounded-3xl bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 text-sm"
                        onClick={handleSearch}
                    >
                        <span>Search</span>
                    </button>
                    <button
                        className="rounded-3xl bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 text-sm"
                        onClick={() => {
                            setSearchTerm("");
                            setFilteredWorker(null);
                            setError(null);
                        }}
                    >
                        <span>Clear</span>
                    </button>
                </label>
            </div>
            <div className="m-7 flex justify-center content-center">
                {error}
            </div>
            <div className="mt-4"
            >
                {filteredWorker && (
                    <div key={filteredWorker.workerName}>
                        <div className="year-section p-4 cursor-pointer flex items-center justify-between bg-gray-200">
                            <span className="font-semibold text-xl">Worker Name: {filteredWorker.workerName}</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className=" mb-3 bg-white border border-gray-200 rounded-lg shadow-md mt-4"
                                style={{ width: '100%' }}
                            >
                                <thead>
                                    <tr className="bg-gray-50 text-gray-700">
                                        <th className="px-10 py-1 text-left">Date</th>
                                        <th className="px-10 py-1 text-left">Hours Worked</th>
                                        <th className="px-10 py-1 text-left">Evening Hours</th>
                                        <th className="px-10 py-1 text-left">Night Hours</th>
                                        <th className="px-10 py-1 text-left">Overtime Hours</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredWorker.years.flatMap((year) =>
                                        year.months.flatMap((month) =>
                                            month.days.map((day, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-6 py-2 border-b border-gray-200">{day.date}</td>
                                                    <td className="px-6 py-2 border-b border-gray-200">{day.hours_worked}</td>
                                                    <td className="px-6 py-2 border-b border-gray-200">{day.evening_hours}</td>
                                                    <td className="px-6 py-2 border-b border-gray-200">{day.night_hours}</td>
                                                    <td className="px-6 py-2 border-b border-gray-200">{day.overtime_hours}</td>
                                                </tr>
                                            ))
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
