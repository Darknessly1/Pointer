import express from "express";
import RateLimit from "express-rate-limit";
import { showSchedule, addSchedule, updateSchedule, deleteSchedule } from "../controllers/schedule.contoller.js";

const router = express.Router();

const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

router.get("/showSchedule", showSchedule);

router.post("/addSchedule", addSchedule);

router.put("/updateSchedule/:id", updateSchedule);

router.delete("/deleteSchedule/:id", limiter, deleteSchedule);



export default router;