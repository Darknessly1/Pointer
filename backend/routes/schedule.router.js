import express from "express";
import RateLimit from "express-rate-limit";
import { showSchedule, addSchedule, updateSchedule, deleteSchedule, showScheduleGroupedByUser } from "../controllers/schedule.contoller.js";
import { authenticateUser } from "../middleware/authenticateUser.js";

const router = express.Router();

const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
});

router.get("/showSchedule", showSchedule);

router.get("/showScheduleGroupedByUser", showScheduleGroupedByUser);

router.post("/addSchedule", authenticateUser, addSchedule);

router.put("/updateSchedule/:id", limiter, updateSchedule);

router.delete("/deleteSchedule/:id", limiter, deleteSchedule);



export default router;