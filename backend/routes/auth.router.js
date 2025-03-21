import express from "express";
import { fetchingUsers, login, logout, signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

router.get("/fetchUsers", fetchingUsers)

export default router;