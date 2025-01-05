/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import WorkerSearch from '../components/WorkerSearch';
import WorkerTable from '../components/WorkerTable';
import ProfessionOptions from '../components/ProfessionOptions';
import MainTable from '../components/MainTable';

import {
    Card,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";

const Test = () => {
    const [inputs, setInputs] = useState({
        checkIn1: '',
        checkOut1: '',
        checkIn2: '',
        checkOut2: '',
        date: '',
        workerName: '',
        workerDetails: '',
        birthDate: '',
        address: '',
        idCard: '',
        gender: '',
        email: ''
    });

    const [workers, setWorkers] = useState([]);
    const [message, setMessage] = useState('');
    const [message1, setMessage1] = useState('');
    const [result, setResult] = useState('');
    const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
    const [isEditPopupVisibleRecords, setIsEditPopupVisibleRecords] = useState(false);
    const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);
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
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [alertType, setAlertType] = useState("");
    const [isSectionVisible, setIsSectionVisible] = useState(true);
    const [currentWorker, setCurrentWorker] = useState([]);
    const [openWorkerId, setOpenWorkerId] = useState(null);
    const [isSectionOpen, setIsSectionOpen] = useState(false);
    const [isWorkerInfoInputOpen, setIsWorkerInfoInputOpen] = useState(false);


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

    const clearMessageAfterDelay = (message, type, delay = 5000) => {
        setMessage1(message);
        setAlertType(type);  // Set alert type (success, delete, update, error)
        setOpen(true);

        setTimeout(() => {
            setMessage1('');
            setAlertType('');
            setOpen(false);
        }, delay);
    };

    const clearMessageAfterDelay1 = (delay = 5000) => {
        setTimeout(() => {
            setMessage('');
        }, delay);
    };

    const addWorkersBasicInformation = async () => {
        const { workerName, workerDetails, birthDate, address, idCard, gender, email } = inputs;

        if (!workerName || !workerDetails || !birthDate || !address || !idCard || !gender || !email) {
            clearMessageAfterDelay('Please provide both worker name and details.', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov|io|co|us|uk|ca|info|biz)$/;
        if (!emailRegex.test(email)) {
            clearMessageAfterDelay('Please provide a valid email address with a recognized domain.', 'error');
            return;
        }

        const newRecord = { workerName, workerDetails, birthDate, address, idCard, gender, email };

        try {
            const response = await fetch('http://localhost:5000/api/workers/add-worker', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRecord),
            });

            if (response.ok) {
                clearMessageAfterDelay('Worker added successfully!', 'success');
                fetchWorkers();
            } else {
                const error = await response.json();
                clearMessageAfterDelay(`Failed to add worker: ${error.message || response.statusText}`, 'error');
            }
        } catch (error) {
            console.error('Error adding worker:', error);
            clearMessageAfterDelay('An error occurred while adding the worker. Please try again later.', 'error');
        }
    };

    const addWorkerInfoToTable = async () => {
        const resultElement = document.getElementById("result");
        const dateInput = document.getElementById("date-input");

        if (!resultElement || !resultElement.innerHTML) {
            setMessage("Please calculate the overtime before adding information.");
            clearMessageAfterDelay1();
            return;
        }

        if (!dateInput || !dateInput.value) {
            setMessage("Please provide a valid date.");
            clearMessageAfterDelay1();
            return;
        }

        const totalHoursMatch = resultElement.innerHTML.match(/Total hours worked: (\d+\.\d+)/);
        const eveningHoursMatch = resultElement.innerHTML.match(/Evening overtime hours: (\d+\.\d+)/);
        const nightHoursMatch = resultElement.innerHTML.match(/Night overtime hours: (\d+\.\d+)/);

        if (!totalHoursMatch) {
            setMessage("Please calculate the overtime before adding information.");
            clearMessageAfterDelay1();
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
                clearMessageAfterDelay1();
            } else {
                const error = await response.json();
                setMessage(`Failed to add record: ${error.message}`);
                clearMessageAfterDelay1();
            }
        } catch (error) {
            console.error("Error adding record:", error);
            setMessage("An error occurred. Please try again.");
            clearMessageAfterDelay1();
        }
    };

    const handleReset = () => {
        setInputs({
            checkIn1: '',
            checkOut1: '',
            checkIn2: '',
            checkOut2: '',
            date: '',
        });
        setResult('');
        setMessage('');
    };

    const handleReset1 = () => {
        setInputs({
            workerName: '',
            workerDetails: '',
            birthDate: '',
            address: '',
            idCard: '',
            gender: '',
            email: ''
        });
        setMessage1('');
    };

    const removeWorker = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/workers/delete-worker/${selectedWorker._id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                clearMessageAfterDelay('Worker removed successfully!', 'delete');
                setWorkers((prev) => prev.filter((worker) => worker._id !== selectedWorker._id));
                setCurrentWorker((prev) => prev.filter((worker) => worker._id !== selectedWorker._id));
                if (currentWorker.length <= 1) {
                    setCurrentWorker([]);
                }
                fetchWorkers();
            } else {
                const error = await response.json();
                clearMessageAfterDelay(`Failed to remove worker: ${error.message || response.statusText}`, 'error');
            }
        } catch (error) {
            console.error('Error removing worker:', error);
            clearMessageAfterDelay('An error occurred while removing the worker.', 'error');
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
                clearMessageAfterDelay1();
            } else {
                const errorData = await response.json();
                console.error("Error deleting record:", errorData.message);
                setMessage(`Failed to delete record: ${errorData.message}`);
                clearMessageAfterDelay1();
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage("An error occurred while deleting the record. Please try again later.");
            clearMessageAfterDelay1();
        }
    };

    const handleSave = async () => {
        const { workerName, workerDetails, birthDate, address, idCard, gender, email } = updatedData;

        if (!workerName || !workerDetails || !birthDate || !address || !idCard || !gender || !email) {
            clearMessageAfterDelay('Please provide all required fields.', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov|io|co|us|uk|ca|info|biz)$/;
        if (!emailRegex.test(email)) {
            clearMessageAfterDelay('Please provide a valid email address with a recognized domain.', 'error');
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/workers/update-worker/${selectedWorker._id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ workerName, workerDetails, birthDate, address, idCard, gender, email }),
                }
            );

            if (response.ok) {
                const updatedWorker = await response.json();

                setWorkers((prev) =>
                    prev.map((worker) =>
                        worker._id === selectedWorker._id ? updatedWorker : worker
                    )
                );

                setCurrentWorker((prev) =>
                    prev.map((worker) =>
                        worker._id === selectedWorker._id ? updatedWorker : worker
                    )
                );

                clearMessageAfterDelay('Worker updated successfully!', 'update');
                setIsEditPopupVisible(false);
            } else {
                const error = await response.json();
                setMessage(`Failed to update worker: ${error.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error updating worker:', error);
            clearMessageAfterDelay('An error occurred while updating the worker. Please try again later.', 'error');
        }
    };

    const handleSaveRecords = async () => {
        const { checkIn1, checkOut1, checkIn2, checkOut2, date } = updatedData;

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
            clearMessageAfterDelay("Invalid data: Year, month, or date is missing.");
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

                clearMessageAfterDelay('Record updated successfully!');
                setIsEditPopupVisibleRecords(false);
            } else {
                const error = await response.json();
                clearMessageAfterDelay(`Failed to update record: ${error.message || 'Unknown error'}`);
            }
        } catch (error) {
            clearMessageAfterDelay('An error occurred while saving. Please try again later.');
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
                setOpenWorkerId(workerId);
                setIsSectionVisible(false);
                setIsSectionOpen(true);
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

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentWorkers = workers.slice(indexOfFirstRecord, indexOfLastRecord);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleSearchResult = (workers) => {
        setCurrentWorker(workers);
    };

    return (
        <div>
            <h1 className='text-3xl font-bold text-center'>Overtime Calculator</h1>

            <div className="m-3 flex flex-col">
                {message1 && open && (
                    <div
                        className={`border-2 border-black fixed top-4 left-1/2 transform -translate-x-1/2 p-2 rounded-xl w-fit shadow-lg z-[100] ${alertType === "success"
                            ? "bg-green-500"
                            : alertType === "delete"
                                ? "bg-red-500"
                                : alertType === "update"
                                    ? "bg-blue-500"
                                    : alertType === "error"
                                        ? "bg-gray-500"
                                        : ""
                            }`}
                    >
                        <div className="flex justify-between items-center text-white">
                            <p>{message1}</p>
                            <Button
                                size="sm"
                                color="transparent"
                                onClick={() => setOpen(false)}
                                className="text-white bg-black/30 ml-2"
                            >
                                &times;
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <div className='flex content-center justify-center'>
                <div>
                    <WorkerSearch onSearchResult={handleSearchResult} />
                </div>
                <div className='border-r-4 border-black'
                    style={{marginLeft: "200px"}}
                ></div>
                <div
                    className='flex content-center justify-center py-8'
                    style={{
                        marginLeft: "200px"

                    }}>
                    <button
                        onClick={() => setIsWorkerInfoInputOpen(true)}
                        className='text-lg border-2 border-gray-600 rounded-3xl px-2 py-1 mr-0 hover:border-black font-bold '
                    >
                        Add Worker Information
                    </button>
                </div>
            </div>

            <div>

            </div>

            {!currentWorker.length ? (
                <div className='relative flex flex-col w-full h-full text-gray-700'>
                    <div className='relative mx-4 mt-4 overflow-hidden text-gray-700  rounded-none bg-clip-border'>
                        <MainTable
                            currentWorkers={currentWorkers}
                            handleWorkerSelection={handleWorkerSelection}
                            setSelectedWorker={setSelectedWorker}
                            setUpdatedData={setUpdatedData}
                            setIsEditPopupVisible={setIsEditPopupVisible}
                            setIsDeletePopupVisible={setIsDeletePopupVisible}
                        />
                        <div className="flex items-center justify-between p-4 border-b border-t border-blue-gray-50">
                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                Page {currentPage} of {Math.ceil(workers.length / recordsPerPage)}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    className="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                    type="button"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                >
                                    Previous
                                </button>
                                <button
                                    className="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                    type="button"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(workers.length / recordsPerPage)))}
                                >
                                    Next
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            ) : (
                <WorkerTable
                    workers={currentWorker}
                    handleWorkerSelection={handleWorkerSelection}
                    setSelectedWorker={setSelectedWorker}
                    setUpdatedData={setUpdatedData}
                    setIsEditPopupVisible={setIsEditPopupVisible}
                    setIsDeletePopupVisible={setIsDeletePopupVisible}
                />

            )}

            {isSectionOpen && selectedWorker && (
                <div>
                    <div className='flex justify-center content-center m-6'>
                        <button
                            onClick={() => setIsSectionOpen(false)}
                            className=" border-1 bg-red-400 rounded-3xl px-4 text-xl text-white"
                        >
                            Close Details
                        </button>
                    </div>

                    <h1
                        className='text-3xl font-bold m-6 flex content-center justify-center'
                    >
                        Workers Records <span className='text-green-700 ml-2'> {selectedWorker.workerName}</span>
                    </h1>

                    <div className="flex content-center justify-center">
                        <button
                            onClick={() => {
                                if (openWorkerId === selectedWorker._id) {
                                    setIsSectionVisible((prev) => !prev);
                                } else {
                                    setOpenWorkerId(selectedWorker._id);
                                    setIsSectionVisible(true);
                                }
                            }}
                            className="rounded-3xl bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2"
                        >
                            {isSectionVisible && openWorkerId === selectedWorker._id
                                ? "Close Section"
                                : "Open Section"}
                        </button>
                    </div>
                    {isSectionVisible && (
                        <>
                            <div className="m-3 flex flex-col items-center">
                                <div className="bg-white/70 border-2 border-black shadow-xl p-6 rounded-2xl w-full max-w-4xl">
                                    <Card color="transparent" shadow={false}>
                                        <Typography variant="h4" color="blue-gray" className="text-center">
                                            Time Input Form
                                        </Typography>
                                        <Typography color="gray" className="mt-1 text-center font-normal">
                                            Please fill in the details below.
                                        </Typography>
                                        <form className="mt-8 mb-2 w-full max-w-screen-lg">
                                            <div className="flex flex-wrap justify-between gap-6">
                                                <div className="w-full md:w-[48%]">
                                                    <Typography variant="h6" color="blue-gray" className="mb-3">
                                                        Check-In 1
                                                    </Typography>
                                                    <Input
                                                        type="time"
                                                        id="checkIn1"
                                                        value={inputs.checkIn1}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>

                                                {/* Check-Out 1 */}
                                                <div className="w-full md:w-[48%]">
                                                    <Typography variant="h6" color="blue-gray" className="mb-3">
                                                        Check-Out 1
                                                    </Typography>
                                                    <Input
                                                        type="time"
                                                        id="checkOut1"
                                                        value={inputs.checkOut1}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>

                                                {/* Check-In 2 */}
                                                <div className="w-full md:w-[48%]">
                                                    <Typography variant="h6" color="blue-gray" className="mb-3">
                                                        Check-In 2
                                                    </Typography>
                                                    <Input
                                                        type="time"
                                                        id="checkIn2"
                                                        value={inputs.checkIn2}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>

                                                {/* Check-Out 2 */}
                                                <div className="w-full md:w-[48%]">
                                                    <Typography variant="h6" color="blue-gray" className="mb-3">
                                                        Check-Out 2
                                                    </Typography>
                                                    <Input
                                                        type="time"
                                                        id="checkOut2"
                                                        value={inputs.checkOut2}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>

                                                {/* Date */}
                                                <div className="w-full md:w-[48%]">
                                                    <Typography variant="h6" color="blue-gray" className="mb-3">
                                                        Date
                                                    </Typography>
                                                    <Input
                                                        type="date"
                                                        id="date-input"
                                                    />
                                                </div>
                                            </div>
                                        </form>

                                        {/* Buttons Section */}
                                        <div className="flex justify-center gap-4 mt-6">
                                            <Button
                                                onClick={calculateOvertimePay}
                                                className="rounded-lg bg-green-500 hover:bg-green-700 text-white font-medium px-4 py-2"
                                            >
                                                Calculate Overtime
                                            </Button>
                                            <Button
                                                onClick={addWorkerInfoToTable}
                                                className="rounded-lg bg-blue-500 hover:bg-blue-700 text-white font-medium px-4 py-2"
                                            >
                                                Add Information
                                            </Button>
                                            <Button
                                                onClick={handleReset}
                                                className="rounded-lg bg-gray-500 hover:bg-gray-700 text-white font-medium px-4 py-2"
                                            >
                                                Restart
                                            </Button>
                                        </div>
                                    </Card>
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
                        </>
                    )
                    }
                </div >
            )}

            {isEditPopupVisible && updatedData && (
                <div className="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white/80 rounded-3xl shadow-lg p-6 w-full max-w-5xl border-2 border-black">
                        <h2 className="text-xl font-bold mb-4">Edit Worker</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSave();
                            }}
                        >
                            <div className="grid grid-cols-3 gap-4">
                                <div className="mb-4">
                                    <label className="font-bold block text-lg mb-1">Worker Name:</label>
                                    <input
                                        type="text"
                                        value={updatedData.workerName}
                                        onChange={(e) =>
                                            setUpdatedData({ ...updatedData, workerName: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border-2 border-black rounded-lg focus:outline-none "
                                        placeholder="Worker Name"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-lg font-bold mb-1">Profession:</label>
                                    <select
                                        type="text"
                                        value={updatedData.workerDetails}
                                        onChange={(e) =>
                                            setUpdatedData({ ...updatedData, workerDetails: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border-2 border-black rounded-lg focus:outline-none"
                                        placeholder="Department"
                                        required
                                    >
                                        <ProfessionOptions />
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-lg font-bold mb-1">Birth Date:</label>
                                    <input
                                        type="date"
                                        value={updatedData.birthDate}
                                        onChange={(e) =>
                                            setUpdatedData({ ...updatedData, birthDate: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border-2 border-black rounded-lg focus:outline-none"
                                        placeholder="Birth Date"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-lg font-bold mb-1">Address:</label>
                                    <input
                                        type="text"
                                        value={updatedData.address}
                                        onChange={(e) =>
                                            setUpdatedData({ ...updatedData, address: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border-2 border-black rounded-lg focus:outline-none"
                                        placeholder="Address"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-lg font-bold mb-1">Card ID:</label>
                                    <input
                                        type="text"
                                        value={updatedData.idCard}
                                        onChange={(e) =>
                                            setUpdatedData({ ...updatedData, idCard: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border-2 border-black rounded-lg focus:outline-none"
                                        placeholder="Card ID"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-lg font-bold mb-1">Gender:</label>
                                    <input
                                        type="text"
                                        value={updatedData.gender}
                                        onChange={(e) =>
                                            setUpdatedData({ ...updatedData, gender: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border-2 border-black rounded-lg focus:outline-none"
                                        placeholder="Gender"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-lg font-bold mb-1">Email:</label>
                                    <input
                                        type="text"
                                        value={updatedData.email}
                                        onChange={(e) =>
                                            setUpdatedData({ ...updatedData, email: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border-2 border-black rounded-lg focus:outline-none"
                                        placeholder="Email"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Action buttons */}
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
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-[100]">
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

            {isWorkerInfoInputOpen && (
                <div className="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white/80 rounded-3xl shadow-lg p-6 w-full max-w-5xl border-2 border-black">
                        <Card color="transparent" shadow={false}>
                            <Typography variant="h4" color="blue-gray" className="text-center mb-4">
                                Worker Information
                            </Typography>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <Typography variant="h6" color="blue-gray">
                                        Worker Full Name
                                    </Typography>
                                    <Input
                                        type="text"
                                        id="workerName"
                                        value={inputs.workerName}
                                        onChange={handleInputChange1}
                                        placeholder="Full Name"
                                        size="lg"
                                    />
                                </div>
                                <div>
                                    <Typography variant="h6" color="blue-gray">
                                        Profession
                                    </Typography>
                                    <select
                                        id="workerDetails"
                                        value={inputs.workerDetails}
                                        onChange={handleInputChange1}
                                        className="border-2 border-gray-500 px-2 py-2 rounded-2xl w-full"
                                    >
                                        <ProfessionOptions />
                                    </select>
                                </div>
                                <div>
                                    <Typography variant="h6" color="blue-gray">
                                        Birth Date
                                    </Typography>
                                    <Input
                                        type="date"
                                        id="birthDate"
                                        value={inputs.birthDate}
                                        onChange={handleInputChange1}
                                        size="lg"
                                    />
                                </div>
                                <div>
                                    <Typography variant="h6" color="blue-gray">
                                        Full Address
                                    </Typography>
                                    <Input
                                        type="text"
                                        id="address"
                                        value={inputs.address}
                                        onChange={handleInputChange1}
                                        placeholder="Address"
                                        size="lg"
                                    />
                                </div>
                                <div>
                                    <Typography variant="h6" color="blue-gray">
                                        Card ID
                                    </Typography>
                                    <Input
                                        type="text"
                                        id="idCard"
                                        value={inputs.idCard}
                                        onChange={handleInputChange1}
                                        placeholder="Card ID"
                                        size="lg"
                                    />
                                </div>
                                <div>
                                    <Typography variant="h6" color="blue-gray">
                                        Gender
                                    </Typography>
                                    <select
                                        id="gender"
                                        value={inputs.gender}
                                        onChange={handleInputChange1}
                                        className="border-2 border-gray-500 px-2 py-2 rounded-2xl w-full"
                                    >
                                        <option value="" disabled>
                                            Select a Gender
                                        </option>
                                        <option>Male</option>
                                        <option>Female</option>
                                    </select>
                                </div>
                                <div>
                                    <Typography variant="h6" color="blue-gray">
                                        Email
                                    </Typography>
                                    <Input
                                        type="email"
                                        id="email"
                                        value={inputs.email}
                                        onChange={handleInputChange1}
                                        placeholder="Email"
                                        size="lg"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-center gap-4 mt-6">
                                <Button onClick={() => {
                                    addWorkersBasicInformation()
                                    setIsWorkerInfoInputOpen(false)
                                }}
                                    className="w-full sm:w-auto">
                                    Add Information to Table
                                </Button>
                                <Button
                                    onClick={handleReset1}
                                    color="gray"
                                    className="w-full sm:w-auto"
                                >
                                    Restart
                                </Button>
                                <Button
                                    onClick={() => setIsWorkerInfoInputOpen(false)}
                                    color="gray"
                                    className="w-full sm:w-auto"
                                >
                                    Close
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div >
    );
};

export default Test;
