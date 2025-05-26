import express from "express";
import { getMessages } from "../controllers/chat.controller.js";

const router = express.Router();

/**  
 * removing this part bnecause is no longer used to send messages via HTTP POST, 
 * instead we are using socket.io for real-time messaging
*/
// router.post("/send", sendMessage);

router.get("/messages", getMessages);

export default router;
