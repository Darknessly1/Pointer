import { useState, useEffect } from 'react';
// import axios from 'axios';

const Test = () => {
    const [inputs, setInputs] = useState({
        checkIn1: '',
        checkOut1: '',
        checkIn2: '',
        checkOut2: '',
        workDate: '',
        workerName: '',
        workerDetails: '',
    });

    const [workers, setWorkers] = useState([]);
    const [message, setMessage] = useState('');
    const [result, setResult] = useState('');

    const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
    const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [updatedData, setUpdatedData] = useState({});


    // useEffect(() => {
    //     fetch('http://localhost:5000/workers')
    //         .then((response) => response.json())
    //         .then((data) => setWorkers(data))
    //         .catch((error) => console.error('Error fetching workers:', error));
    // }, []);


    useEffect(() => {
        fetch('http://localhost:5000/workers')
            .then((res) => res.json())
            .then((data) => {
                console.log(data); // Debug the structure
                // If `data` is an array of workers directly, set it directly
                setWorkers(data); // Set workers array directly
            })
            .catch((error) => console.error('Error fetching workers:', error));
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setInputs({ ...inputs, [id]: value });
    };

    const timeToDecimal = (hours, minutes) => hours + minutes / 60;

    const adjustForOvernightShift = (startDec, endDec) =>
        endDec < startDec ? endDec + 24 : endDec;

    const calculateHoursWorked = (startTime, endTime) => {
        let startDec = timeToDecimal(...startTime.split(":").map(Number));
        let endDec = timeToDecimal(...endTime.split(":").map(Number));
        endDec = adjustForOvernightShift(startDec, endDec);
        return endDec - startDec;
    };

    const calculateOvertime = (overtimeStart, endTime, periodStart, periodEnd, multiplier) => {
        const startDec = overtimeStart;
        let endDec = timeToDecimal(...endTime.split(":").map(Number));
        endDec = adjustForOvernightShift(startDec, endDec);

        let overtimeHours = 0;
        if (periodStart > periodEnd) {
            const period1End = 24;
            const overtime1 = Math.min(endDec, period1End) - Math.max(startDec, periodStart);
            const overtime2 = Math.min(endDec - 24, periodEnd) - Math.max(startDec - 24, 0);
            overtimeHours = Math.max(overtime1, 0) + Math.max(overtime2, 0);
        } else {
            const overtimeStart = Math.max(startDec, periodStart);
            const overtimeEnd = Math.min(endDec, periodEnd);
            overtimeHours = Math.max(overtimeEnd - overtimeStart, 0);
        }
        return overtimeHours * multiplier;
    };

    const calculateRegularAndOvertimeHours = (shifts) => {
        let regularHours = 0;
        let overtimeStart = null;
        let totalHours = 0;

        shifts.forEach((shift) => {
            const shiftHours = calculateHoursWorked(shift.start, shift.end);
            totalHours += shiftHours;

            if (regularHours < 8) {
                const remainingRegularHours = 8 - regularHours;
                if (shiftHours <= remainingRegularHours) {
                    regularHours += shiftHours;
                } else {
                    regularHours += remainingRegularHours;
                    overtimeStart = timeToDecimal(...shift.start.split(":").map(Number)) + remainingRegularHours;
                }
            } else if (!overtimeStart) {
                overtimeStart = timeToDecimal(...shift.start.split(":").map(Number));
            }
        });

        return { regularHours, overtimeStart, totalHours };
    };

    const calculateOvertimePay = () => {
        const { checkIn1, checkOut1, checkIn2, checkOut2 } = inputs;

        if (timeToDecimal(...checkIn2.split(":").map(Number)) <= timeToDecimal(...checkOut1.split(":").map(Number))) {
            setResult("Calculation stopped: Check-in 2 cannot be before Check-out 1.");
            return;
        }

        const { regularHours, overtimeStart, totalHours } = calculateRegularAndOvertimeHours([
            { start: checkIn1, end: checkOut1 },
            { start: checkIn2, end: checkOut2 },
        ]);

        let resultText = `Total hours worked: ${totalHours.toFixed(2)}\nRegular hours: ${Math.min(regularHours, 8).toFixed(2)}\n`;

        if (totalHours > 8 && overtimeStart) {
            const eveningOvertime = calculateOvertime(overtimeStart, checkOut2, 17, 21, 1.25);
            const nightOvertime = calculateOvertime(overtimeStart, checkOut2, 21, 5, 1.5);

            const totalOvertimePay = eveningOvertime + nightOvertime;

            resultText += `Evening overtime hours: ${(eveningOvertime / 1.25).toFixed(2)} with multiplier 1.25, pay: ${eveningOvertime.toFixed(2)}\n`;
            resultText += `Night overtime hours: ${(nightOvertime / 1.5).toFixed(2)} with multiplier 1.5, pay: ${nightOvertime.toFixed(2)}\n`;
            resultText += `Total Overtime Pay: ${totalOvertimePay.toFixed(2)}`;
        } else {
            resultText += "No overtime applicable.";
        }

        setResult(resultText);
    };

    const addWorkerInfoToTable = async () => {
        const { workDate, workerName, workerDetails } = inputs;

        const resultElement = document.getElementById("result");
        if (!resultElement) {
            setMessage("Please calculate the overtime before adding information.");
            return;
        }

        const totalHoursMatch = resultElement.innerHTML.match(/Total hours worked: (\d+\.\d+)/);
        const regularHoursMatch = resultElement.innerHTML.match(/Regular hours: (\d+\.\d+)/);
        const eveOTMatch = resultElement.innerHTML.match(/Evening overtime hours: (\d+\.\d+)/);
        const nightOTMatch = resultElement.innerHTML.match(/Night overtime hours: (\d+\.\d+)/);

        if (!totalHoursMatch || !regularHoursMatch) {
            setMessage("Please calculate the overtime before adding information.");
            return;
        }

        const newRecord = {
            date: workDate,
            workerName,
            workerDetails,
            totalHours: parseFloat(totalHoursMatch[1]),
            regularHours: parseFloat(regularHoursMatch[1]),
            eveningHours: eveOTMatch ? parseFloat(eveOTMatch[1]) : 0,
            nightHours: nightOTMatch ? parseFloat(nightOTMatch[1]) : 0,
        };

        try {
            const response = await fetch('http://localhost:5000/add-worker', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRecord),
            });

            if (response.ok) {
                setMessage('Record added successfully!');
                // Fetch the updated workers data to reflect the new record in the table
                fetchWorkers();
            } else {
                setMessage(`Failed to add the record: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred while adding the record. Please try again later.');
        }
    };


    const fetchWorkers = () => {
        fetch('http://localhost:5000/workers')
            .then((res) => res.json())
            .then((data) => {
                console.log(data); // Debug the structure
                setWorkers(data); // Update the state with the new workers list
            })
            .catch((error) => console.error('Error fetching workers:', error));
    };

    useEffect(() => {
        fetchWorkers(); // Fetch the workers when the component mounts
    }, []);


    const handleReset = () => {
        setInputs({
            checkIn1: '',
            checkOut1: '',
            checkIn2: '',
            checkOut2: '',
            workDate: '',
            workerName: '',
            workerDetails: '',
        });
        setResult('');
        setMessage('');
    };

    const editWorker = async (id, updatedData) => {
        try {
            const response = await fetch(`http://localhost:5000/edit-worker/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });
    
            if (response.ok) {
                setMessage('Worker updated successfully!');
                fetchWorkers(); // Refresh the table
            } else {
                setMessage(`Failed to update worker: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error updating worker:', error);
            setMessage('An error occurred while updating the worker.');
        }
    };

    
    const removeWorker = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/remove-worker/${id}`, {
                method: 'DELETE',
            });
    
            if (response.ok) {
                setMessage('Worker removed successfully!');
                fetchWorkers(); // Refresh the table
            } else {
                setMessage(`Failed to remove worker: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error removing worker:', error);
            setMessage('An error occurred while removing the worker.');
        }
    };
    


    return (
        <div>
            <h1 className='text-3xl font-bold text-center'>Overtime Calculator</h1>

            <div className="m-3 flex flex-col">
                <div className="flex flex-wrap justify-center gap-4">
                    <div className="flex items-center gap-2">
                        <label htmlFor="workerName " className='mb-4 font-bold'>Worker Full Name:</label>
                        <input
                            type="text"
                            id="workerName"
                            value={inputs.workerName}
                            onChange={handleInputChange}
                            className="border-2 border-gray-500 px-2 rounded-2xl"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="workerDetails" className='mb-4 font-bold'>Worker Details:</label>
                        <input
                            type="text"
                            id="workerDetails"
                            value={inputs.workerDetails}
                            onChange={handleInputChange}
                            className="border-2 border-gray-500 px-2 rounded-2xl"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="workDate" className='mb-4 font-bold'>Work Date:</label>
                        <input
                            type="date"
                            id="workDate"
                            value={inputs.workDate}
                            onChange={handleInputChange}
                            className="border-2 border-gray-500 px-2 rounded-2xl"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="checkIn1" className='mb-4 font-bold'>Check-In 1:</label>
                        <input
                            type="time"
                            id="checkIn1"
                            value={inputs.checkIn1}
                            onChange={handleInputChange}
                            className="border-2 border-gray-500 px-2 rounded-2xl"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="checkOut1" className='mb-4 font-bold'>Check-Out 1:</label>
                        <input
                            type="time"
                            id="checkOut1"
                            value={inputs.checkOut1}
                            onChange={handleInputChange}
                            className="border-2 border-gray-500 px-2 rounded-2xl"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="checkIn2" className='mb-4 font-bold'>Check-In 2:</label>
                        <input
                            type="time"
                            id="checkIn2"
                            value={inputs.checkIn2}
                            onChange={handleInputChange}
                            className="border-2 border-gray-500 px-2 rounded-2xl"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="checkOut2" className='mb-4 font-bold'>Check-Out 2:</label>
                        <input
                            type="time"
                            id="checkOut2"
                            value={inputs.checkOut2}
                            onChange={handleInputChange}
                            className="border-2 border-gray-500 px-2 rounded-2xl"
                        />
                    </div>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={calculateOvertimePay}
                        className="rounded-3xl bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 text-sm"
                    >
                        Calculate Overtime
                    </button>
                    <button
                        onClick={addWorkerInfoToTable}
                        className="rounded-3xl bg-sky-500 hover:bg-sky-700 text-white font-bold py-1 px-2 text-sm"
                    >
                        Add Information to Table
                    </button>
                    <button
                        onClick={handleReset}
                        className="rounded-3xl bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 text-sm"
                    >
                        Restart
                    </button>
                </div>
                <div>
                    {message && <p className="text-center mt-4">{message}</p>}
                </div>
            </div>

            <div id="result"
                className='flex justify-center m-2'
            >
                {result &&
                    <pre
                        className='p-2 border-2 border-black rounded-2xl'
                    >
                        {result}
                    </pre>
                }
            </div>

            <div className='flex justify-center rounded-2xl'>
                <table className='border-2 border-black rounded-2xl'>
                    <thead>
                        <tr>
                            <th className='border-2 border-black px-2'>number of employee</th>
                            <th className='border-2 border-black px-2'>Date</th>
                            <th className='border-2 border-black px-2'>Worker Name</th>
                            <th className='border-2 border-black px-2'>Details</th>
                            <th className='border-2 border-black px-2'>Total Hours</th>
                            <th className='border-2 border-black px-2'>Regular Hours</th>
                            <th className='border-2 border-black px-2'>Evening Hours</th>
                            <th className='border-2 border-black px-2'>Night Hours</th>
                            <th className='border-2 border-black px-2'>Edit/Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(workers) && workers.map((worker, index) => (
                            <tr key={worker._id}>
                                <td className='border-2 border-black p-2'>{index + 1}</td>
                                <td className='border-2 border-black p-2'>{worker.date}</td>
                                <td className='border-2 border-black p-2'>{worker.workerName}</td>
                                <td className='border-2 border-black p-2'>{worker.workerDetails}</td>
                                <td className='border-2 border-black p-2'>{worker.totalHours}</td>
                                <td className='border-2 border-black p-2'>{worker.regularHours}</td>
                                <td className='border-2 border-black p-2'>{worker.eveningHours}</td>
                                <td className='border-2 border-black p-2'>{worker.nightHours}</td>
                                <td className='border-2 border-black p-2'>
                                    <button
                                        className="mr-2 rounded-3xl bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 text-sm"
                                        onClick={() => {
                                            setSelectedWorker(worker);
                                            setUpdatedData(worker);
                                            setIsEditPopupVisible(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="rounded-3xl bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 text-sm"
                                        onClick={() => {
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

            {isEditPopupVisible && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-md">
                        <h2 className="text-xl font-bold mb-4">Edit Worker</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                editWorker(selectedWorker._id, updatedData);
                                setIsEditPopupVisible(false);
                            }}
                        >
                            <div className="mb-2">
                                <label className="block font-semibold">Worker Name:</label>
                                <input
                                    type="text"
                                    className="border rounded w-full p-2"
                                    value={updatedData.workerName}
                                    onChange={(e) => setUpdatedData({ ...updatedData, workerName: e.target.value })}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block font-semibold">Worker Details:</label>
                                <textarea
                                    className="border rounded w-full p-2"
                                    value={updatedData.workerDetails}
                                    onChange={(e) => setUpdatedData({ ...updatedData, workerDetails: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="mb-2">
                                <label className="block font-semibold">Total Hours:</label>
                                <input
                                    type="number"
                                    className="border rounded w-full p-2"
                                    value={updatedData.totalHours}
                                    onChange={(e) => setUpdatedData({ ...updatedData, totalHours: e.target.value })}
                                />
                            </div>
                            {/* Add other fields as needed */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white py-1 px-4 rounded mr-2"
                                    onClick={() => setIsEditPopupVisible(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="bg-blue-500 text-white py-1 px-4 rounded">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {isDeletePopupVisible && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-md">
                        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                        <p className="mb-4">
                            Are you sure you want to delete the worker: <strong>{selectedWorker.workerName}</strong>?
                        </p>
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-500 text-white py-1 px-4 rounded mr-2"
                                onClick={() => setIsDeletePopupVisible(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-500 text-white py-1 px-4 rounded"
                                onClick={() => {
                                    removeWorker(selectedWorker._id);
                                    setIsDeletePopupVisible(false);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Test;
