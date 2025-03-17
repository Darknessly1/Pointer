import express from 'express';
import dotenv from "dotenv";
import path from "path";
import workerRoutes from './routes/workerTest.js';
import authRouter from './routes/auth.router.js';
import scheduleRouter from './routes/schedule.router.js';
import teamschedule from './routes/team.router.js';
import fetchEmails from './routes/email.router.js';
import { fileURLToPath } from "url";
import chatRouter from './routes/chat.router.js';
import cors from 'cors';
import connectToMongoDB from './db/connectToMongoDB.js';
import fetchUser from './routes/user.router.js';
import http from 'http'; 
import { setupSocket } from './socket/socket.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({ path: '../.env' });

const PORT = process.env.PORT || 2000;
const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app); 

setupSocket(server); 

// Middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/workers', workerRoutes);
app.use('/api/schedule', scheduleRouter);
app.use('/api/team', teamschedule);
app.use('/api/user', fetchUser);
app.use('/api/email', fetchEmails);
app.use('/api/chat', chatRouter);



server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server running on port ${PORT}`)
});
