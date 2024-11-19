import { useState, useEffect } from "react";

function OvertimeCalculator() {
    const [inputs, setInputs] = useState({
        checkIn1: "",
        checkOut1: "",
        checkIn2: "",
        checkOut2: "",
        workDate: "",
        workerName: "",
        workerDetails: "",
    });
    const [result, setResult] = useState("");
    const [workers, setWorkers] = useState([]);
    // const [message, setMessage] = useState("");
    const [backendStatus, setBackendStatus] = useState("Checking...");

    // const [message, setMessage] = useState("");

    // useEffect(() => {
    //     fetch("http://localhost:3000/message")
    //         .then((res) => res.json())
    //         .then((data) => setMessage(data.message));
    // }, []);


    useEffect(() => {
        fetch('http://localhost:3000/api/health')
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to connect to backend");
                }
            })
            .then((data) => {
                setBackendStatus(data.message); // Update status on success
            })
            .catch((error) => {
                setBackendStatus("Failed to connect to backend");
                console.error("Error:", error);
            });
    }, []);


    // Fetch records from the backend
    useEffect(() => {
        fetch('http://localhost:3000/api/records')
            .then((response) => response.json())
            .then((data) => setWorkers(data))
            .catch((error) => console.error('Error fetching workers:', error));
    }, []);
    console.log(workers);

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
        const workDate = document.getElementById("workDate").value;
        const workerName = document.getElementById("workerName").value;
        const workerDetails = document.getElementById("workerDetails").value;

        const totalHoursMatch = document.getElementById("result").innerHTML.match(/Total hours worked: (\d+\.\d+)/);
        const regularHoursMatch = document.getElementById("result").innerHTML.match(/Regular hours: (\d+\.\d+)/);
        const eveOTMatch = document.getElementById("result").innerHTML.match(/Evening overtime hours: (\d+\.\d+)/);
        const nightOTMatch = document.getElementById("result").innerHTML.match(/Night overtime hours: (\d+\.\d+)/);

        if (!totalHoursMatch || !regularHoursMatch) {
            alert("Please calculate the overtime before adding information.");
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
            const response = await fetch('http://localhost:3000/api/records', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRecord),
            });

            if (response.ok) {
                const savedRecord = await response.json();
                console.log('Record saved successfully:', savedRecord);

                // Add the new record to the state
                setWorkers((prevWorkers) => [...prevWorkers, savedRecord]);

                alert('Record added successfully!');
            } else {
                console.error('Failed to save record:', response.statusText);
                alert(`Failed to add the record: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the record. Please try again later.');
        }
    };



    return (
        <div>
            {/* <h1>{message}</h1> */}
            <h1>Overtime Calculator</h1>

            <div>
                <h1>Backend Connection Status</h1>
                <p>{backendStatus}</p>
            </div>

            <label htmlFor="checkIn1">First Check-In Time:</label>
            <input type="time" id="checkIn1" value={inputs.checkIn1} onChange={handleInputChange} />

            <label htmlFor="checkOut1">First Check-Out Time:</label>
            <input type="time" id="checkOut1" value={inputs.checkOut1} onChange={handleInputChange} />

            <label htmlFor="checkIn2">Second Check-In Time:</label>
            <input type="time" id="checkIn2" value={inputs.checkIn2} onChange={handleInputChange} />

            <label htmlFor="checkOut2">Second Check-Out Time:</label>
            <input type="time" id="checkOut2" value={inputs.checkOut2} onChange={handleInputChange} />

            <button onClick={calculateOvertimePay}>Calculate Overtime</button>

            <div>{result.split("\n").map((line, index) => <div key={index}>{line}</div>)}</div>

            <label htmlFor="workDate">Work Date:</label>
            <input type="date" id="workDate" value={inputs.workDate} onChange={handleInputChange} />

            <label htmlFor="workerName">Worker Name:</label>
            <input type="text" id="workerName" value={inputs.workerName} onChange={handleInputChange} />

            <label htmlFor="workerDetails">Worker Details:</label>
            <input type="text" id="workerDetails" value={inputs.workerDetails} onChange={handleInputChange} />

            <button onClick={addWorkerInfoToTable}>Add Information to Table</button>
            {/* {message && <p className="message">{message}</p>}  */}

            <div>
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
                        {workers.map((worker) => (
                            <tr key={worker._id}>
                                <td>{new Date(worker.date).toLocaleDateString()}</td>
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
        </div>
    );

}

export default OvertimeCalculator;
