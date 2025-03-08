import express from 'express';
import dotenv from "dotenv";
import multer from "multer";
import path from "path";

import workerRoutes from './routes/workerTest.js';
import authRouter from './routes/auth.router.js';
import scheduleRouter from './routes/schedule.router.js';
import teamschedule from './routes/team.router.js';
import { fileURLToPath } from "url";

import cors from 'cors';
import  connectToMongoDB  from './db/connectToMongoDB.js';
import fetchUser from './routes/user.router.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({ path: '../.env' });


const PORT = process.env.PORT || 2000;
const app = express();
app.use(cors());

// Middleware
app.use(express.json());
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

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadPath = path.join(__dirname, 'public', 'uploads');
//         // Ensure the uploads directory exists
//         fs.mkdirSync(uploadPath, { recursive: true });
//         cb(null, uploadPath);
//     },
//     filename: (req, file, cb) => {
//         // Generate a unique filename
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//     }
// });

// // Create multer upload instance
// const upload = multer({ 
//     storage: storage,
//     limits: { 
//         fileSize: 5 * 1024 * 1024 // 5MB file size limit
//     },
//     fileFilter: (req, file, cb) => {
//         // Allow only specific image types
//         const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
//         if (allowedTypes.includes(file.mimetype)) {
//             cb(null, true);
//         } else {
//             cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
//         }
//     }
// });

// Routes
app.use('/api/auth', authRouter);
app.use('/api/workers', workerRoutes);
app.use('/api/schedule', scheduleRouter);
app.use('/api/team', teamschedule);
app.use('/api/user', fetchUser);


// console.log("MongoDB URL:", process.env.MONGO_DB_URL); 


app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server running on port ${PORT}`)
});
