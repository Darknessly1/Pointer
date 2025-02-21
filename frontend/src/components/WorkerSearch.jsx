/* eslint-disable react/prop-types */
import { useState } from "react";

export default function WorkerSearch({ onSearchResult }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:9000/api/workers/search-worker?name=${searchTerm}`);
            const data = await response.json();

            if (response.ok) {
                setError(null);
                onSearchResult([data]); 
            } else {
                setError(data.message || "Worker not found.");
                onSearchResult([]); 
            }
        } catch (err) {
            setError("An error occurred while searching.", err);
            onSearchResult([]); 
        }
    };

    return (
        <div className="relative mx-auto py-5">
            <div className="flex justify-between items-center">
                <label
                    className="flex content-center justify-center border py-2 px-2 rounded-full gap-2 shadow-2xl focus-within:border-gray-300"
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
                            setError(null);
                            onSearchResult([]); 
                        }}
                    >
                        <span>Clear</span>
                    </button>
                </label>
            </div>
            {error && <div className="m-7 text-red-500">{error}</div>}
        </div>
    );
}
