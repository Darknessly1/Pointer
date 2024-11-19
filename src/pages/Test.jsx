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


    const addWorker = async (newWorker) => {
        try {
            const response = await fetch('http://localhost:5000/workers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newWorker),
            });

            if (response.ok) {
                // If the addition was successful, update the workers state directly
                setWorkers((prevWorkers) => [...prevWorkers, newWorker]);
            }
        } catch (error) {
            console.error('Error adding worker:', error);
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


    return (
        <div>
            <h1>Overtime Calculator</h1>

            <label htmlFor="workerName">Worker Name:</label>
            <input type="text" id="workerName" value={inputs.workerName} onChange={handleInputChange} />

            <label htmlFor="workerDetails">Worker Details:</label>
            <input type="text" id="workerDetails" value={inputs.workerDetails} onChange={handleInputChange} />

            <label htmlFor="workDate">Work Date:</label>
            <input type="date" id="workDate" value={inputs.workDate} onChange={handleInputChange} />

            <label htmlFor="checkIn1">Check-In 1:</label>
            <input type="time" id="checkIn1" value={inputs.checkIn1} onChange={handleInputChange} />

            <label htmlFor="checkOut1">Check-Out 1:</label>
            <input type="time" id="checkOut1" value={inputs.checkOut1} onChange={handleInputChange} />

            <label htmlFor="checkIn2">Check-In 2:</label>
            <input type="time" id="checkIn2" value={inputs.checkIn2} onChange={handleInputChange} />

            <label htmlFor="checkOut2">Check-Out 2:</label>
            <input type="time" id="checkOut2" value={inputs.checkOut2} onChange={handleInputChange} />

            <button onClick={calculateOvertimePay}>Calculate Overtime</button>
            <button onClick={addWorkerInfoToTable}>Add Information to Table</button>
            {message && <p>{message}</p>}

            <div id="result">
                <pre>{result}</pre>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Worker Name</th>
                        <th>Details</th>
                        <th>Total Hours</th>
                        <th>Regular Hours</th>
                        <th>Evening Hours</th>
                        <th>Night Hours</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(workers) && workers.map((worker) => (
                        <tr key={worker._id}>
                            <td>{worker.date}</td>
                            <td>{worker.workerName}</td>
                            <td>{worker.workerDetails}</td>
                            <td>{worker.totalHours}</td>
                            <td>{worker.regularHours}</td>
                            <td>{worker.eveningHours}</td>
                            <td>{worker.nightHours}</td>
                        </tr>
                    ))}
                </tbody>


            </table>
        </div>
    );
};

export default Test;
