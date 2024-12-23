/* eslint-disable react/prop-types */
const WorkerTable = ({ workers, handleWorkerSelection, setSelectedWorker, setUpdatedData, setIsEditPopupVisible, setIsDeletePopupVisible }) => {
    if (!workers || workers.length === 0) {
        return <p className="text-center text-gray-500"></p>;
    }

    return (
        <div className="relative flex flex-col w-full h-full text-gray-700">
            <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 rounded-none bg-clip-border">
                <div className="p-6 px-0 overflow-auto">
                    <table className="w-full mt-4 text-left table-auto min-w-max border-2 border-black">
                        <thead className="border-b-2 border-black">
                            <tr>
                                {["Number", "Full Name", "Department", "Edit/Remove"].map((header) => (
                                    <th
                                        key={header}
                                        className="p-4 transition-colors cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 hover:bg-blue-gray-50"
                                    >
                                        <p className="font-bold flex items-center justify-between gap-2 font-sans text-sm antialiased leading-none text-blue-gray-900 opacity-70">
                                            {header}
                                        </p>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {workers.map((worker) => (
                                <tr key={worker._id} className="odd:bg-white even:bg-gray-200">
                                    <td className="p-4 border-b border-blue-gray-50">
                                        <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                            {worker._id}
                                        </p>
                                    </td>
                                    <td
                                        className="p-4 border-b border-blue-gray-50 cursor-pointer text-blue-600 hover:underline"
                                        onClick={() => handleWorkerSelection(worker._id)}
                                    >
                                        {worker.workerName}
                                    </td>
                                    <td className="p-4 border-b border-blue-gray-50">
                                        <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                            {worker.workerDetails}
                                        </p>
                                    </td>
                                    <td className="border-b border-blue-gray-50">
                                        <button
                                            className="mr-2 rounded-3xl bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2"
                                            onClick={() => {
                                                setSelectedWorker(worker);
                                                setUpdatedData(worker);
                                                setIsEditPopupVisible(true);
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            className="rounded-3xl bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2"
                                            onClick={() => {
                                                setSelectedWorker(worker);
                                                setIsDeletePopupVisible(true);
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                                                />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default WorkerTable;
