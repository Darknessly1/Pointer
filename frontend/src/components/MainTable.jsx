/* eslint-disable react/prop-types */

const MainTable = ({
    currentWorkers,
    handleWorkerSelection,
    setSelectedWorker,
    setUpdatedData,
    setIsEditPopupVisible,
    setIsDeletePopupVisible,
}) => {
    return (
        <div className="p-6 px-0 overflow-auto">
            <table className="w-full mt-4 text-left table-auto min-w-max border-2 border-black">
                <thead className="border-b-2 border-black">
                    <tr>
                        {['Email', 'Full Name', 'Profession', 'Birth Date', 'Address', 'Card ID', 'Gender', 'Edit/Remove'].map((header) => (
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
                    {Array.isArray(currentWorkers) &&
                        currentWorkers.map((worker) => (
                            <tr key={worker._id} className="odd:bg-white even:bg-gray-200">
                                <td className="p-4 border-b border-blue-gray-50">{worker.email}</td>
                                <td
                                    className="p-4 border-b border-blue-gray-50 cursor-pointer text-blue-600 hover:underline"
                                    onClick={() => handleWorkerSelection(worker._id)}
                                >
                                    {worker.workerName}
                                </td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <p className='border-1 border-black rounded-2xl bg-blue-gray-100 w-fit px-2 block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900'>
                                        {worker.workerDetails}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <p className='block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900'>
                                        {worker.birthDate}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <p className='block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900'>
                                        {worker.address}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <p className='block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900'>
                                        {worker.idCard}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <p className='block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900'>
                                        {worker.gender}
                                    </p>
                                </td>
                                <td className="border-b border-blue-gray-50">
                                    <button
                                        className="mr-2 rounded-3xl bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2"
                                        onClick={(event) => {
                                            event.stopPropagation(); 
                                            setSelectedWorker(worker);
                                            setUpdatedData(worker);
                                            setIsEditPopupVisible(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="rounded-3xl bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setSelectedWorker(worker);
                                            setIsDeletePopupVisible(true);
                                        }}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default MainTable;
