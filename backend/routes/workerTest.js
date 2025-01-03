import express from 'express';
import Worker from '../models/WorkerTest.js';
const router = express.Router();


/* Fetching data */

// Fetch a specific worker
router.get('/worker/:id', async (req, res) => {
    try {
        const worker = await Worker.findById(req.params.id);
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found.' });
        }
        res.status(200).json(worker);
    } catch (error) {
        console.error('Error fetching worker:', error.message);
        res.status(500).json({ message: 'Failed to fetch worker.' });
    }
});

// Fetch all workers
router.get('/all-workers', async (req, res) => {
    try {
        const workers = await Worker.find();
        res.status(200).json(workers);
    } catch (error) {
        console.error('Error fetching workers:', error.message);
        res.status(500).json({ message: 'Failed to fetch workers.' });
    }
});


// This is the original post worker


// router.post('/add-worker', async (req, res) => {
//     let { workerName, workerDetails } = req.body;

//     if (!workerName || !workerDetails) {
//         return res.status(400).json({ message: 'Worker name and details are required.' });
//     }

//     const sanitizedWorkerName = workerName
//         .trim()
//         .replace(/\s+/g, ' ') // Replace multiple spaces with one
//         .toLowerCase();

//     try {
//         const existingWorker = await Worker.findOne({ workerName: sanitizedWorkerName });
//         if (existingWorker) {
//             return res.status(400).json({ message: 'Worker already exists.' });
//         }

//         const newWorker = new Worker({
//             workerName: sanitizedWorkerName,
//             workerDetails,
//             years: [],
//         });

//         await newWorker.save();
//         res.status(201).json({ message: 'Worker added successfully.', worker: newWorker });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to add worker.' });
//     }
// });

// And this is the copy version of it.


router.post('/add-worker', async (req, res) => {
    let { workerName, workerDetails, birthDate, address, idCard, gender, email } = req.body;

    if (!workerName || !workerDetails || !birthDate || !address || !idCard || !gender || !email) {
        return res.status(400).json({ message: 'Worker name and details are required.' });
    }

    const sanitizedWorkerName = workerName
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase();

    try {
        const existingWorker = await Worker.findOne({ workerName: sanitizedWorkerName });
        if (existingWorker) {
            return res.status(400).json({ message: 'Worker already exists.' });
        }

        const newWorker = new Worker({
            workerName: sanitizedWorkerName,
            workerDetails,
            birthDate,
            address,
            idCard,
            gender,
            email,
            years: [],
        });

        await newWorker.save();
        res.status(201).json({ message: 'Worker added successfully.', worker: newWorker });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add worker.' });
    }
});

router.post('/add-record/:workerId', async (req, res) => {
    try {
        const { workerId } = req.params;
        const { year, month, date, hours_worked, evening_hours, night_hours, overtime_hours } = req.body;

        // Validate input
        if (!year || !month || !date || hours_worked === undefined || evening_hours === undefined || night_hours === undefined || overtime_hours === undefined) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Ensure year, month, and date are valid
        const numericYear = parseInt(year, 10);
        const numericMonth = parseInt(month, 10);

        if (isNaN(numericYear) || numericYear < 1) {
            return res.status(400).json({ message: 'Year must be a valid positive number.' });
        }
        if (isNaN(numericMonth) || numericMonth < 1 || numericMonth > 12) {
            return res.status(400).json({ message: 'Month must be a valid number between 1 and 12.' });
        }

        // Validate and format the date
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: 'Date must be a valid date string.' });
        }
        const formattedDate = `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}-${String(parsedDate.getDate()).padStart(2, '0')}`;

        // Find the worker
        let worker = await Worker.findById(workerId);
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found.' });
        }

        // Locate or create the year record
        let yearIndex = worker.years.findIndex((y) => y.year === numericYear);
        if (yearIndex === -1) {
            worker.years.push({ year: numericYear, months: [] });
        }
        // Ensure years are sorted incrementally
        worker.years.sort((a, b) => a.year - b.year);
        yearIndex = worker.years.findIndex((y) => y.year === numericYear);
        const yearRecord = worker.years[yearIndex];

        // Locate or create the month record
        let monthIndex = yearRecord.months.findIndex((m) => m.month === numericMonth);
        if (monthIndex === -1) {
            yearRecord.months.push({ month: numericMonth, days: [] });
        }
        // Ensure months are sorted incrementally
        yearRecord.months.sort((a, b) => a.month - b.month);
        monthIndex = yearRecord.months.findIndex((m) => m.month === numericMonth);
        const monthRecord = yearRecord.months[monthIndex];

        // Check if a day with the same date exists
        const existingDay = monthRecord.days.find((d) => d.date === formattedDate);
        if (existingDay) {
            return res.status(400).json({ message: `Record for the date ${formattedDate} already exists.` });
        }

        // Add the new day record
        monthRecord.days.push({
            date: formattedDate, // Store date as a string in "YYYY-MM-DD" format
            hours_worked,
            evening_hours,
            night_hours,
            overtime_hours,
        });

        // Ensure days are sorted incrementally by date
        monthRecord.days.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Save the updated worker document
        await worker.save();

        res.status(200).json({ message: 'Record added successfully.' });
    } catch (error) {
        console.error('Error adding record:', error);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
});

/* Update Section */

router.put('/update-worker/:workerId', async (req, res) => {
    try {
        const { workerId } = req.params;
        const { workerName, workerDetails, birthDate, address, idCard, gender, email } = req.body;

        if (!workerName || !workerDetails || !birthDate || !address || !idCard || !gender || !email) {
            return res.status(400).json({ message: 'Worker name and details are required' });
        }

        const updatedWorker = await Worker.findByIdAndUpdate(
            workerId,
            { workerName, workerDetails, birthDate, address, idCard, gender, email },
            { new: true }
        );

        if (!updatedWorker) {
            return res.status(404).json({ message: 'Worker not found.' });
        }

        res.status(200).json(updatedWorker);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Failed to update worker', error: error.message });
    }
});

router.put('/update-hours/:workerId/:year/:month/:date', async (req, res) => {
    try {
        const { workerId, year, month, date } = req.params;
        const { hours_worked, evening_hours, night_hours, overtime_hours } = req.body;

        const worker = await Worker.findById(workerId);
        if (!worker) return res.status(404).json({ message: 'Worker not found.' });

        const yearData = worker.years.find((y) => y.year === parseInt(year));
        if (!yearData) return res.status(404).json({ message: 'Year not found.' });

        const monthData = yearData.months.find((m) => m.month === parseInt(month));
        if (!monthData) return res.status(404).json({ message: 'Month not found.' });

        const dayRecord = monthData.days.find((d) => d.date === date);
        if (!dayRecord) return res.status(404).json({ message: 'Day not found.' });

        if (hours_worked !== undefined) dayRecord.hours_worked = hours_worked;
        if (evening_hours !== undefined) dayRecord.evening_hours = evening_hours;
        if (night_hours !== undefined) dayRecord.night_hours = night_hours;
        if (overtime_hours !== undefined) dayRecord.overtime_hours = overtime_hours;

        await worker.save();

        res.status(200).json({
            message: 'Hours updated successfully.',
            updatedDay: dayRecord,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update hours.', error: error.message });
    }
});

/* Delete section  */

// Delete record
router.delete('/delete-record/:workerId/:year/:month/:date', async (req, res) => {
    try {
        const { workerId, year, month, date } = req.params;

        const numericYear = parseInt(year, 10);
        const numericMonth = parseInt(month, 10);

        if (isNaN(numericYear) || isNaN(numericMonth) || numericMonth < 1 || numericMonth > 12) {
            return res.status(400).json({ message: 'Invalid year or month provided.' });
        }

        const worker = await Worker.findById(workerId);
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found.' });
        }

        const yearData = worker.years.find((y) => y.year === numericYear);
        if (!yearData) {
            return res.status(404).json({ message: `Year ${numericYear} not found for the worker.` });
        }

        const monthData = yearData.months.find((m) => m.month === numericMonth);
        if (!monthData) {
            return res.status(404).json({ message: `Month ${numericMonth} not found for the year ${numericYear}.` });
        }

        const dayIndex = monthData.days.findIndex((d) => d.date === date);
        if (dayIndex === -1) {
            return res.status(404).json({ message: `No record found for the date ${date}.` });
        }

        monthData.days.splice(dayIndex, 1);

        await worker.save();

        res.status(200).json({
            message: `Record for the date ${date} successfully deleted.`,
        });
    } catch (error) {
        console.error('Error deleting record:', error.message);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
});

// Delete a worker
router.delete('/delete-worker/:id', async (req, res) => {
    try {
        const worker = await Worker.findByIdAndDelete(req.params.id);
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found.' });
        }
        res.status(200).json({ message: 'Worker deleted successfully.', worker });
    } catch (error) {
        console.error('Error deleting worker:', error.message);
        res.status(500).json({ message: 'Failed to delete worker.' });
    }
});

/* Search Section */

router.get('/search-worker', async (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ message: "Worker name is required for search." });
    }

    try {
        const worker = await Worker.findOne({ workerName: name });

        if (!worker) {
            return res.status(404).json({ message: "Worker not found." });
        }

        res.status(200).json(worker);
    } catch (error) {
        console.error('Error searching for worker:', error);
        res.status(500).json({ message: "An error occurred while searching for the worker." });
    }
});


export default router;
