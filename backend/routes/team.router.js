import express from "express";
import { createTeam, getTeams } from "../controllers/teams.controller.js";

const router = express.Router();

router.get("/getTeams", getTeams);
router.post("/createTeam", createTeam);

export default router;
