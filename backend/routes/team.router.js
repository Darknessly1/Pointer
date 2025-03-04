import express from "express";
import { createTeam, getTeams } from "../controllers/teams.controller.js";
import { authenticateUser } from "../middleware/authenticateUser.js";

const router = express.Router();

router.get("/getTeams", authenticateUser , getTeams);
router.post("/createTeam", authenticateUser , createTeam); 

export default router;
