import express from 'express';
import { addingWorker, addingWorkerDetails, deleteWorker, deleteWorkersRecord, fetchingWorker, fetchingWorkers, search, updateWorker, updateWorkerDetails } from '../controllers/worker.contoller.js';
const router = express.Router();


/* Fetching data */

// Fetch a specific worker
router.get('/worker/:id', fetchingWorker);

// Fetch all workers
router.get('/all-workers', fetchingWorkers);


/* Adding Workers */

router.post('/add-worker', addingWorker);

router.post('/add-record/:workerId', addingWorkerDetails);

/* Update Section */

router.put('/update-worker/:workerId', updateWorker);

router.put('/update-hours/:workerId/:year/:month/:date', updateWorkerDetails);

/* Delete section  */

// Delete record
router.delete('/delete-record/:workerId/:year/:month/:date', deleteWorkersRecord);

// Delete a worker

router.delete('/delete-worker/:id', deleteWorker);

/* Search Section */

router.get('/search-worker', search);


export default router;
