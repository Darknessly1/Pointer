import { useState, useEffect } from 'react';
import axios from 'axios';

const Test = () => {
  const [inputs, setInputs] = useState({
    checkIn1: '',
    checkOut1: '',
    checkIn2: '',
    checkOut2: '',
    workDate: '',
    workerName: '',
    workerDetails: ''
  });
  
  const [workers, setWorkers] = useState([]);
  const [message, setMessage] = useState('');

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [id]: value
    }));
  };

  // Function to add worker info to the backend
  const addWorkerInfoToTable = async () => {
    try {
      const response = await axios.post('http://localhost:5000/add-worker', {
        date: inputs.workDate,
        workerName: inputs.workerName,
        workerDetails: inputs.workerDetails,
        totalHours: 8, // Hardcoded value for now; replace with actual logic
        regularHours: 8,
        eveningHours: 0,
        nightHours: 0
      });

      setMessage(response.data.message);
      fetchWorkers(); // Re-fetch workers to update table
    } catch (err) {
      console.error(err);
      setMessage('Failed to add worker info.');
    }
  };

  // Function to fetch workers from the backend
  const fetchWorkers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/workers');
      setWorkers(response.data);
    } catch (err) {
      console.error(err);
      setMessage('Failed to fetch workers.');
    }
  };

  // Fetch workers when component mounts
  useEffect(() => {
    fetchWorkers();
  }, []);

  return (
    <div>
      <h1>Overtime Calculator</h1>

      {/* Input fields */}
      <label htmlFor="workerName">Worker Name:</label>
      <input type="text" id="workerName" value={inputs.workerName} onChange={handleInputChange} />
      
      <label htmlFor="workerDetails">Worker Details:</label>
      <input type="text" id="workerDetails" value={inputs.workerDetails} onChange={handleInputChange} />
      
      <label htmlFor="workDate">Work Date:</label>
      <input type="date" id="workDate" value={inputs.workDate} onChange={handleInputChange} />
      
      <button onClick={addWorkerInfoToTable}>Add Information to Table</button>
      {message && <p>{message}</p>}

      {/* Display Workers Table */}
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
  );
};

export default Test;
