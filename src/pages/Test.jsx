/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import WorkerSearch from '../components/WorkerSearch';

const Test = () => {
    const [inputs, setInputs] = useState({
        checkIn1: '',
        checkOut1: '',
        checkIn2: '',
        checkOut2: '',
        date: '',
        workerName: '',
        workerDetails: '',
    });

    const [workers, setWorkers] = useState([]);
    const [message, setMessage] = useState('');
    const [message1, setMessage1] = useState('');
    const [result, setResult] = useState('');

    const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
    const [isEditPopupVisibleRecords, setIsEditPopupVisibleRecords] = useState(false);
    const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);
    // const [updatedData, setUpdatedData] = useState({});
    const [updatedData, setUpdatedData] = useState({
        checkIn1: "",
        checkOut1: "",
        checkIn2: "",
        checkOut2: "",
        year: "",
        month: "",
        date: ""
    });
    const [openYear, setOpenYear] = useState(null);
    const [openMonth, setOpenMonth] = useState(null);



    useEffect(() => {
        // Set the message after a timeout of 3 seconds
        const timeout = setTimeout(() => {
            setMessage1();
        }, 3000);

        // Cleanup function to clear timeout when component unmounts
        return () => clearTimeout(timeout);
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setInputs({ ...inputs, [id]: value });
    };

    const handleInputChange1 = (e) => {
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

    const clearMessageAfterDelay = (delay = 3000) => {
        setTimeout(() => {
            setMessage1('');
        }, delay);
    };

    const addWorkersBasicInformation = async () => {
        const { workerName, workerDetails } = inputs;

        if (!workerName || !workerDetails) {
            setMessage1('Please provide both worker name and details.');
            clearMessageAfterDelay();
            return;
        }

        const newRecord = {
            workerName,
            workerDetails,
        };

        try {
            const response = await fetch('http://localhost:5000/api/workers/add-worker', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRecord),
            });

            if (response.ok) {
                setMessage1('Worker added successfully!');
                clearMessageAfterDelay();
                fetchWorkers();
            } else {
                const error = await response.json();
                setMessage1(`Failed to add worker: ${error.message || response.statusText}`);
                clearMessageAfterDelay();
            }
        } catch (error) {
            console.error('Error adding worker:', error);
            setMessage1('An error occurred while adding the worker. Please try again later.');
            clearMessageAfterDelay();
        }
    };

    const addWorkerInfoToTable = async () => {
        const resultElement = document.getElementById("result");
        const dateInput = document.getElementById("date-input");

        if (!resultElement || !resultElement.innerHTML) {
            setMessage("Please calculate the overtime before adding information.");
            return;
        }

        if (!dateInput || !dateInput.value) {
            setMessage("Please provide a valid date.");
            return;
        }

        const totalHoursMatch = resultElement.innerHTML.match(/Total hours worked: (\d+\.\d+)/);
        const eveningHoursMatch = resultElement.innerHTML.match(/Evening overtime hours: (\d+\.\d+)/);
        const nightHoursMatch = resultElement.innerHTML.match(/Night overtime hours: (\d+\.\d+)/);

        if (!totalHoursMatch) {
            setMessage("Please calculate the overtime before adding information.");
            return;
        }

        const hoursWorked = parseFloat(totalHoursMatch[1]);
        const eveningHours = eveningHoursMatch ? parseFloat(eveningHoursMatch[1]) : 0;
        const nightHours = nightHoursMatch ? parseFloat(nightHoursMatch[1]) : 0;
        const overtimeHours = hoursWorked > 8 ? hoursWorked - 8 : 0;

        const date = new Date(dateInput.value);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        const newRecord = {
            year,
            month,
            date: dateInput.value,
            hours_worked: hoursWorked,
            evening_hours: eveningHours,
            night_hours: nightHours,
            overtime_hours: overtimeHours,
        };

        try {
            const response = await fetch(`http://localhost:5000/api/workers/add-record/${selectedWorker._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRecord),
            });

            if (response.ok) {
                const updatedWorker = await response.json();

                // Ensure no duplicates in state update
                const updatedYears = [...selectedWorker.years];
                let yearIndex = updatedYears.findIndex((y) => y.year === newRecord.year);

                if (yearIndex === -1) {
                    updatedYears.push({ year: newRecord.year, months: [] });
                    updatedYears.sort((a, b) => a.year - b.year);
                    yearIndex = updatedYears.findIndex((y) => y.year === newRecord.year);
                }

                const yearRecord = updatedYears[yearIndex];
                let monthIndex = yearRecord.months.findIndex((m) => m.month === newRecord.month);

                if (monthIndex === -1) {
                    yearRecord.months.push({ month: newRecord.month, days: [] });
                    yearRecord.months.sort((a, b) => a.month - b.month);
                    monthIndex = yearRecord.months.findIndex((m) => m.month === newRecord.month);
                }

                const monthRecord = yearRecord.months[monthIndex];
                const existingRecord = monthRecord.days.find((day) => day.date === newRecord.date);

                if (!existingRecord) {
                    monthRecord.days.push(newRecord);
                    monthRecord.days.sort((a, b) => new Date(a.date) - new Date(b.date));
                }

                setSelectedWorker({ ...selectedWorker, years: updatedYears });
                setMessage("Record added successfully.");
            } else {
                const error = await response.json();
                setMessage(`Failed to add record: ${error.message}`);
            }
        } catch (error) {
            console.error("Error adding record:", error);
            setMessage("An error occurred. Please try again.");
        }
    };

    const handleReset = () => {
        setInputs({
            checkIn1: '',
            checkOut1: '',
            checkIn2: '',
            checkOut2: '',
        });
        setResult('');
        setMessage('');
    };

    const handleReset1 = () => {
        setInputs({
            workerName: '',
            workerDetails: '',
        });
        setMessage1('');
    };

    const removeWorker = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/workers/delete-worker/${selectedWorker._id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setMessage('Worker removed successfully!');
                fetchWorkers();
            } else {
                const error = await response.json();
                setMessage(`Failed to remove worker: ${error.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error removing worker:', error);
            setMessage('An error occurred while removing the worker.');
        }
    };

    const deleteHoursRecord = async (workerId, year, month, date) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/workers/delete-record/${workerId}/${year}/${month}/${date}`,
                {
                    method: 'DELETE',
                }
            );

            if (response.ok) {
                setSelectedWorker((prevWorker) => {
                    // Update the records in the frontend
                    const updatedYears = prevWorker.years.map((y) => {
                        if (y.year === year) {
                            const updatedMonths = y.months.map((m) => {
                                if (m.month === month) {
                                    return {
                                        ...m,
                                        days: m.days.filter((d) => d.date !== date),
                                    };
                                }
                                return m;
                            });
                            return { ...y, months: updatedMonths };
                        }
                        return y;
                    });
                    return { ...prevWorker, years: updatedYears };
                });

                setMessage("Record deleted successfully.");
            } else {
                const errorData = await response.json();
                console.error("Error deleting record:", errorData.message);
                setMessage(`Failed to delete record: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage("An error occurred while deleting the record. Please try again later.");
        }
    };

    const handleSave = async () => {
        const { workerName, workerDetails } = updatedData;

        if (!workerName || !workerDetails) {
            setMessage('Please provide both worker name and details.');
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/workers/update-worker/${selectedWorker._id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ workerName, workerDetails }),
                }
            );

            if (response.ok) {
                const updatedWorker = await response.json();

                setWorkers((prev) =>
                    prev.map((worker) =>
                        worker._id === selectedWorker._id ? updatedWorker : worker
                    )
                );

                setMessage('Worker updated successfully!');
                setIsEditPopupVisible(false);
            } else {
                const error = await response.json();
                setMessage(`Failed to update worker: ${error.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error updating worker:', error);
            setMessage('An error occurred while updating the worker. Please try again later.');
        }
    };

    const handleSaveRecords = async () => {
        const { checkIn1, checkOut1, checkIn2, checkOut2, date } = updatedData;

        // Extract year and month from the date
        const [year, month, day] = date.split('-');

        const { overtimeStart, totalHours } = calculateRegularAndOvertimeHours([
            { start: checkIn1, end: checkOut1 },
            { start: checkIn2, end: checkOut2 },
        ]);

        let eveningOvertime = calculateOvertime(overtimeStart, checkOut2, 17, 21, 1.25);
        let nightOvertime = calculateOvertime(overtimeStart, checkOut2, 21, 5, 1.5);

        if (totalHours === 8) {
            eveningOvertime -= 8;
            if (eveningOvertime < 0) eveningOvertime = 0;
        }

        const updatedRecord = {
            hours_worked: totalHours.toFixed(2),
            evening_hours: (eveningOvertime / 1.25).toFixed(2),
            night_hours: (nightOvertime / 1.5).toFixed(2),
            overtime_hours: ((eveningOvertime / 1.25) + (nightOvertime / 1.5)).toFixed(2),
        };

        if (!year || !month || !day) {
            setMessage("Invalid data: Year, month, or date is missing.");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/workers/update-hours/${selectedWorker._id}/${year}/${month}/${date}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedRecord),
                }
            );

            if (response.ok) {
                const { updatedDay } = await response.json();
                setSelectedWorker((prevWorker) => {
                    const updatedYears = prevWorker.years.map((yearObj) => {
                        if (yearObj.year === parseInt(year)) {
                            const updatedMonths = yearObj.months.map((monthObj) => {
                                if (monthObj.month === parseInt(month)) {
                                    const updatedDays = monthObj.days.map((dayObj) =>
                                        dayObj.date === date ? updatedDay : dayObj
                                    );
                                    return { ...monthObj, days: updatedDays };
                                }
                                return monthObj;
                            });
                            return { ...yearObj, months: updatedMonths };
                        }
                        return yearObj;
                    });
                    return { ...prevWorker, years: updatedYears };
                });

                setMessage('Record updated successfully!');
                setIsEditPopupVisibleRecords(false);
            } else {
                const error = await response.json();
                setMessage(`Failed to update record: ${error.message || 'Unknown error'}`);
            }
        } catch (error) {
            setMessage('An error occurred while saving. Please try again later.');
        }
    };

    const fetchWorkers = () => {
        fetch('http://localhost:5000/api/workers/all-workers')
            .then((res) => res.json())
            .then((data) => {
                setWorkers(data);
            })
            .catch((error) => console.error('Error fetching workers:', error));
    };

    useEffect(() => {
        fetchWorkers();
    }, []);

    const handleWorkerSelection = async (workerId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/workers/worker/${workerId}`);
            if (response.ok) {
                const workerData = await response.json();
                setSelectedWorker(workerData);
            } else {
                const errorData = await response.json();
                console.error("Error fetching worker data:", errorData.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const toggleYear = (year) => {
        setOpenYear(openYear === year ? null : year);
    };

    const toggleMonth = (month) => {
        setOpenMonth(openMonth === month ? null : month);
    };

    return (
        <div>
            <h1 className='text-3xl font-bold text-center'>Overtime Calculator</h1>

            <div className="m-3 flex flex-col">
                <div className="m-3 flex flex-col">
                    <div className="shadow-2xl focus-within:border-gray-300 flex flex-wrap justify-center gap-4 border-2 border-black rounded-2xl ml-20 mr-20 mt-4">
                        <div className="flex items-center gap-2 mt-2">
                            <label htmlFor="workerName" className="mb-4 font-bold mt-2">Worker Full Name:</label>
                            <input
                                type="text"
                                id="workerName"
                                value={inputs.workerName}
                                onChange={handleInputChange1}
                                className="border-2 border-gray-500 px-2 rounded-2xl mb-2"
                            />
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <label htmlFor="workerDetails" className="mb-4 font-bold mt-2">Worker Details:</label>
                            <input
                                type="text"
                                id="workerDetails"
                                value={inputs.workerDetails}
                                onChange={handleInputChange1}
                                className="border-2 border-gray-500 px-2 rounded-2xl mb-2"
                            />
                        </div>
                    </div>
                </div>



                <div className="flex justify-center gap-4 mt-4">

                    <button
                        onClick={addWorkersBasicInformation}
                        className="rounded-3xl bg-light-blue-400  hover:bg-light-blue-700 text-white font-bold py-1 px-2 text-sm"
                    >
                        Add Information to Table
                    </button>
                    <button
                        onClick={handleReset1}
                        className="rounded-3xl bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 text-sm"
                    >
                        Restart
                    </button>
                </div>

                <div>
                    {message1 && <p className="text-center mt-4">{message1}</p>}
                </div>
            </div>

            <div className='relative flex flex-col w-full h-full text-gray-700'>
                <div className='relative mx-4 mt-4 overflow-hidden text-gray-700  rounded-none bg-clip-border'>
                    <div className='flex items-center justify-between gap-8'>
                        <div>
                            <h5 className='block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900'>
                                Workers List
                            </h5>
                            <p className='block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700'>
                                See information about all workers
                            </p>
                        </div>

                        <WorkerSearch workers={workers} />
                    </div>

                    <div className='p-6 px-0 overflow-scroll'>
                        <table className='w-full mt-4 text-left table-auto min-w-max'>
                            <thead>
                                <tr>
                                    <th className='p-4 transition-colors cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 hover:bg-blue-gray-50'>
                                        <p className='font-bold flex items-center justify-between gap-2 font-sans text-sm antialiased leading-none text-blue-gray-900 opacity-70'>
                                            Number
                                        </p>
                                    </th>
                                    <th className='p-4 transition-colors cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 hover:bg-blue-gray-50'>
                                        <p className='font-bold flex items-center justify-between gap-2 font-sans text-sm antialiased` leading-none text-blue-gray-900 opacity-70'>
                                            Full Name
                                        </p>
                                    </th>
                                    <th className='p-4 transition-colors cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 hover:bg-blue-gray-50'>
                                        <p className='font-bold flex items-center justify-between gap-2 font-sans text-sm antialiased` leading-none text-blue-gray-900 opacity-70'>
                                            department
                                        </p>
                                    </th>
                                    <th className='p-4 transition-colors cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 hover:bg-blue-gray-50'>
                                        <p className='font-bold flex items-center justify-between gap-2 font-sans text-sm antialiased` leading-none text-blue-gray-900 opacity-70'>
                                            Edit/Remove
                                        </p>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(workers) && workers.map((worker, index) => (
                                    <tr key={worker._id}
                                        className='odd:bg-white even:bg-gray-200'
                                    >
                                        <td className='p-4 border-b border-blue-gray-50'>
                                            <p className='block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900'>
                                                {index + 1}
                                            </p>
                                        </td>
                                        <td
                                            className="p-4 border-b border-blue-gray-50 cursor-pointer text-blue-600 hover:underline"
                                            onClick={() => handleWorkerSelection(worker._id)}
                                        >
                                            {worker.workerName}
                                        </td>
                                        <td className='p-4 border-b border-blue-gray-50'>
                                            <p className='block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900'>
                                                {worker.workerDetails}
                                            </p>
                                        </td>
                                        <td className='border-b border-blue-gray-50'>
                                            <button
                                                className="mr-2 rounded-3xl bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2"
                                                onClick={() => {
                                                    setSelectedWorker(worker);
                                                    setUpdatedData(worker);
                                                    setIsEditPopupVisible(true);
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
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
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* should be created the pagination */}
                    <div className='flex items-center justify-between p-4 border-t border-blue-gray-50'>
                        <p className='block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900'>
                            Page 1 of 10
                        </p>
                        <div className='flex gap-2'>
                            <button
                                className='select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
                                type='button'>
                                Previous
                            </button>
                            <button
                                className='select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
                                type='button'>
                                Next
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {selectedWorker && (
                <div>
                    <h1
                        className='text-3xl font-bold m-6 flex content-center justify-center'
                    >
                        Workers Records <span className='text-green-700 ml-2'> {selectedWorker.workerName}</span>
                    </h1>
                    <div className="flex flex-wrap justify-center gap-4 mt-4 border-2 border-black rounded-2xl ml-20 mr-20">
                        <div className="flex items-center gap-2  mt-2">
                            <label htmlFor="checkIn1" className="mb-4 font-bold mt-2">Check-In 1:</label>
                            <input
                                type="time"
                                id="checkIn1"
                                value={inputs.checkIn1}
                                onChange={handleInputChange}
                                className="border-2 border-gray-500 px-2 rounded-2xl mb-2"
                            />
                        </div>
                        <div className="flex items-center gap-2  mt-2">
                            <label htmlFor="checkOut1" className="mb-4 font-bold mt-2">Check-Out 1:</label>
                            <input
                                type="time"
                                id="checkOut1"
                                value={inputs.checkOut1}
                                onChange={handleInputChange}
                                className="border-2 border-gray-500 px-2 rounded-2xl mb-2"
                            />
                        </div>
                        <div className="flex items-center gap-2  mt-2">
                            <label htmlFor="checkIn2" className="mb-4 font-bold mt-2">Check-In 2:</label>
                            <input
                                type="time"
                                id="checkIn2"
                                value={inputs.checkIn2}
                                onChange={handleInputChange}
                                className="border-2 border-gray-500 px-2 rounded-2xl mb-2"
                            />
                        </div>
                        <div className="flex items-center gap-2  mt-2">
                            <label htmlFor="checkOut2" className="mb-4 font-bold mt-2">Check-Out 2:</label>
                            <input
                                type="time"
                                id="checkOut2"
                                value={inputs.checkOut2}
                                onChange={handleInputChange}
                                className="border-2 border-gray-500 px-2 rounded-2xl mb-2"
                            />
                        </div>


                        <div className="flex items-center gap-2  mt-2">
                            <label htmlFor="checkOut2" className="mb-4 font-bold mt-2">date</label>
                            <input
                                type="date"
                                id="date-input"
                                className="border-2 border-gray-500 px-2 rounded-2xl mb-2"
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
                            className="rounded-3xl bg-light-blue-400  hover:bg-light-blue-700 text-white font-bold py-1 px-2 text-sm"
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

                    <div>
                        {message && <p className="text-center mt-4">{message}</p>}
                    </div>

                    <div className="flex justify-center items-center mt-10">
                        <div className="w-full max-w-6xl rounded-lg shadow-lg overflow-hidden">

                            {selectedWorker &&
                                selectedWorker.years.map((year) => {
                                    const monthsWithData = year.months.filter((month) => month.days.length > 0);
                                    if (monthsWithData.length > 0) {
                                        return (
                                            <div key={year.year} className="border-b">
                                                <div
                                                    className="year-section  p-4 cursor-pointer flex items-center justify-between bg-gray-200 hover:bg-gray-300"
                                                    onClick={() => toggleYear(year.year)}
                                                >
                                                    <span className="font-semibold text-xl">Year: {year.year}</span>
                                                    <span
                                                        className={`transform transition-transform ${openYear === year.year ? 'rotate-180' : ''}`}
                                                    >
                                                        ▼
                                                    </span>
                                                </div>

                                                {openYear === year.year && (
                                                    monthsWithData.map((month) => (
                                                        <div key={`${year.year}-${month.month}`} className="">
                                                            <div
                                                                className="month-section m-6 p-4 cursor-pointer flex items-center justify-between bg-gray-100 hover:bg-gray-200"
                                                                onClick={() => toggleMonth(month.month)}
                                                            >
                                                                <span className="text-lg">Month: {month.month}</span>
                                                                <span
                                                                    className={`transform transition-transform ${openMonth === month.month ? 'rotate-180' : ''}`}
                                                                >
                                                                    ▼
                                                                </span>
                                                            </div>

                                                            {openMonth === month.month && (
                                                                <table className="min-w-full mb-3 bg-white border border-gray-200 rounded-lg shadow-md mt-4">
                                                                    <thead>
                                                                        <tr className="bg-gray-50 text-gray-700">
                                                                            <th className="px-6 py-1 text-left">Date</th>
                                                                            <th className="px-6 py-1 text-left">Hours Worked</th>
                                                                            <th className="px-6 py-1 text-left">Evening Hours</th>
                                                                            <th className="px-6 py-1 text-left">Night Hours</th>
                                                                            <th className="px-6 py-1 text-left">Overtime Hours</th>
                                                                            <th className="px-6 py-1 text-left">Actions</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {month.days.map((day, dayindex) => (
                                                                            <tr key={dayindex} className="hover:bg-gray-50">
                                                                                <td className="px-6 py-2 border-b border-gray-200">{day.date}</td>
                                                                                <td className="px-6 py-2 border-b border-gray-200">{day.hours_worked}</td>
                                                                                <td className="px-6 py-2 border-b border-gray-200">{day.evening_hours}</td>
                                                                                <td className="px-6 py-2 border-b border-gray-200">{day.night_hours}</td>
                                                                                <td className="px-6 py-2 border-b border-gray-200">{day.overtime_hours}</td>
                                                                                <td className="px-6 py-2 border-b">
                                                                                    <button
                                                                                        className="mr-2 rounded-3xl bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2"
                                                                                        onClick={() => {
                                                                                            setUpdatedData(day);
                                                                                            setIsEditPopupVisibleRecords(true);
                                                                                        }}
                                                                                    >
                                                                                        Edit
                                                                                    </button>
                                                                                    <button
                                                                                        className="rounded-3xl bg-red-600 hover:bg-red-800 text-white font-bold py-1 px-2 transition-colors duration-200"
                                                                                        onClick={() => deleteHoursRecord(selectedWorker._id, year.year, month.month, day.date)}
                                                                                    >
                                                                                        Delete
                                                                                    </button>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                        </div>
                    </div>
                </div>
            )}

            {isEditPopupVisible && (
                <div className="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4">Edit Worker</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSave();
                            }}
                        >
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Worker Name</label>
                                <input
                                    type="text"
                                    value={updatedData.workerName}
                                    onChange={(e) =>
                                        setUpdatedData({ ...updatedData, workerName: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                                    placeholder="Worker Name"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Department</label>
                                <input
                                    type="text"
                                    value={updatedData.workerDetails}
                                    onChange={(e) =>
                                        setUpdatedData({ ...updatedData, workerDetails: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                                    placeholder="Department"
                                    required
                                />
                            </div>
                            <div className="flex justify-center">
                                <button
                                    type="button"
                                    onClick={() => setIsEditPopupVisible(false)}
                                    className="mr-2 rounded-3xl bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="mr-2 rounded-3xl bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 text-sm"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isEditPopupVisibleRecords && (
                <div className="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4">Edit Worker Record</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSaveRecords();
                            }}
                        >
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Check-in 1</label>
                                    <input
                                        type="time"
                                        value={updatedData.checkIn1 || ""}
                                        onChange={(e) =>
                                            setUpdatedData({ ...updatedData, checkIn1: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Check-out 1</label>
                                    <input
                                        type="time"
                                        value={updatedData.checkOut1 || ""}
                                        onChange={(e) =>
                                            setUpdatedData({ ...updatedData, checkOut1: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Check-in 2</label>
                                    <input
                                        type="time"
                                        value={updatedData.checkIn2 || ""}
                                        onChange={(e) =>
                                            setUpdatedData({ ...updatedData, checkIn2: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Check-out 2</label>
                                    <input
                                        type="time"
                                        value={updatedData.checkOut2 || ""}
                                        onChange={(e) =>
                                            setUpdatedData({ ...updatedData, checkOut2: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <button
                                    type="button"
                                    onClick={() => setIsEditPopupVisibleRecords(false)}
                                    className="mr-2 rounded-3xl bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-3xl bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 text-sm"
                                >
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
                                className="mr-2 rounded-3xl bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 text-sm"
                                onClick={() => setIsDeletePopupVisible(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="rounded-3xl bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 text-sm"
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
