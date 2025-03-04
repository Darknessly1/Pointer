import express from "express";
import { fetchCurrentUser, updateCurrentUser, uploadProfilePicture } from "../controllers/users.controller.js";
import { authenticateUser } from "../middleware/authenticateUser.js";

const router = express.Router();

router.get("/fetchCurrentUser", authenticateUser , fetchCurrentUser);
router.post("/updateCurrentUser", authenticateUser , updateCurrentUser); 
router.post("/uploadProfilePicture", authenticateUser , uploadProfilePicture); 

export default router;
