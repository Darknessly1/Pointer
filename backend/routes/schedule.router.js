import express from "express";
import { showSchedule, addSchedule, updateSchedule, deleteSchedule } from "../controllers/schedule.contoller.js";

const router = express.Router();

router.get("/showSchedule", showSchedule);

router.post("/addSchedule", addSchedule);

router.put("/updateSchedule/:id", updateSchedule);

router.delete("/deleteSchedule/:id", deleteSchedule);



export default router;