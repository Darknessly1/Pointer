import express from "express";
import { createTeam, getTeam } from "../controllers/teams.controller.js";

const router = express.Router();

router.get("/", getTeam );

router.post("/", createTeam);

export default router;