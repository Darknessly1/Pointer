import { useState } from "react";

export default function WorkerSearch({ workers }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredWorker, setFilteredWorker] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        // Ensure names are unique and filter the worker list
        const worker = workers.find((w) => w.name.toLowerCase() === searchTerm.toLowerCase());
        setFilteredWorker(worker ? worker : "Worker not found.");
    };

    return (
        <div className="relative bg-white min-w-sm max-w-2xl mx-auto py-5">
            <label
                className="flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-2xl gap-2 shadow-2xl focus-within:border-gray-300"
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
                    className="w-full md:w-auto px-6 py-3 bg-black border-black text-white fill-white active:scale-95 duration-100 border will-change-transform overflow-hidden relative rounded-xl transition-all disabled:opacity-70"
                    onClick={handleSearch}
                >
                    <span className="text-sm font-semibold whitespace-nowrap truncate mx-auto">
                        Search
                    </span>
                </button>
            </label>
            {/* Display filtered worker */}
            <div className="mt-4">
                {filteredWorker && (
                    typeof filteredWorker === "string" ? (
                        <p className="text-red-500">{filteredWorker}</p>
                    ) : (
                        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold">{filteredWorker.name}</h3>
                            <p>Position: {filteredWorker.position}</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
