import express from "express";
import { emailsend, inbox } from "../controllers/email.controller.js";
import { authenticateUser } from "../middleware/authenticateUser.js";

const router = express.Router();

router.post("/send", authenticateUser, emailsend);
router.get("/inbox",authenticateUser, inbox);

export default router;