import express from 'express';
import dotenv from "dotenv";

import workerRoutes from './routes/workerTest.js';
import authRouter from './routes/auth.router.js';
import cors from 'cors';
import  connectToMongoDB  from './db/connectToMongoDB.js';

dotenv.config({ path: '../.env' });


const PORT = process.env.PORT || 2000;
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));     


// Routes
app.use('/api/auth', authRouter);
app.use('/api/workers', workerRoutes);


// console.log("MongoDB URL:", process.env.MONGO_DB_URL); 

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server running on port ${PORT}`)
});
