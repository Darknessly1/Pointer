import express from "express";
import { fetchCurrentUser, updateCurrentUser, uploadProfilePicture, updatePassword } from "../controllers/users.controller.js";
import { authenticateUser } from "../middleware/authenticateUser.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });


router.get("/fetchCurrentUser", authenticateUser , fetchCurrentUser);
router.put("/updateCurrentUser", authenticateUser , updateCurrentUser); 
router.put("/uploadProfilePicture", authenticateUser, upload.single("profilePic"), uploadProfilePicture);
router.put("/update-password", authenticateUser, updatePassword);

export default router;
