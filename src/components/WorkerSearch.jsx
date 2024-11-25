import { useState } from "react";

export default function WorkerSearch() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredWorker, setFilteredWorker] = useState(null);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/search-worker?name=${searchTerm}`);
            const data = await response.json();

            if (response.ok) {
                setFilteredWorker(data);
                setError(null);
            } else {
                setFilteredWorker(null);
                setError(data.message);
            }
        } catch (err) {
            setError("An error occurred while searching.", err);
        }
    };

    return (
        <div className="relative bg-white min-w-sm max-w-2xl mx-auto py-5">
            <label
                className="flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-full gap-2 shadow-2xl focus-within:border-gray-300"
                htmlFor="search-bar"
            >
                <input
                    id="search-bar"
                    placeholder="Enter worker's name"
                    className="px-6 py-2 w-full rounded-md flex-1 outline-none bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    // className="w-full md:w-auto px-6 py-3 bg-black border-black text-white fill-white active:scale-95 duration-100 border will-change-transform overflow-hidden relative rounded-xl transition-all disabled:opacity-70"
                    className="rounded-3xl bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 text-sm"
                    onClick={handleSearch}
                >
                    <span>
                        Search
                    </span>
                </button>
                <button
                    // className="w-full md:w-auto px-6 py-3 bg-gray-300 border-gray-400 text-black fill-black active:scale-95 duration-100 border will-change-transform overflow-hidden relative rounded-xl transition-all mt-2"
                    className="rounded-3xl bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 text-sm"
                    onClick={() => {
                        setSearchTerm("");
                        setFilteredWorker(null);
                        setError(null);
                    }}
                >
                    <span 
                    >
                        Clear
                    </span>
                </button>
            </label>
            <div className="mt-4">
                {filteredWorker ? (
                    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold">Name: {filteredWorker.workerName}</h3>
                        <p>Details: {filteredWorker.workerDetails}</p>
                        <p>Total Hours Worker: {filteredWorker.totalHours}</p>
                        <p>Evening Hours: {filteredWorker.eveningHours}</p>
                        <p>Night Hours: {filteredWorker.nightHours}</p>
                        <p>Date: {filteredWorker.date}</p>
                    </div>
                ) : (
                    error && <p className="text-red-500">{error}</p>
                )}
            </div>
        </div>
    );
}
