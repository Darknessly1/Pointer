import Email from "../models/email.model.js";
import { sendEmail } from "../util/mailer.js";
import User from '../models/user.model.js';

export const emailsend = async (req, res) => {
    const { recipientUsername, recipientEmail, subject, body } = req.body;

    try {
        const senderId = req.user.id;
        const sender = await User.findById(senderId);

        if (!sender) {
            return res.status(404).json({ message: "Sender not found." });
        }

        let recipient;
        let emailAddress;
        
        // Handle internal recipient (user in the app)
        if (recipientUsername) {
            recipient = await User.findOne({ userName: recipientUsername });
            if (!recipient) {
                return res.status(404).json({ message: "Recipient not found." });
            }
            emailAddress = recipient.email;
        } 
        // Handle external recipient (outside email)
        else if (recipientEmail) {
            recipient = { email: recipientEmail };
            emailAddress = recipientEmail;
        } else {
            return res.status(400).json({ message: "Recipient username or email is required." });
        }

        // Save email to database
        const newEmail = new Email({
            sender: senderId,
            recipient: recipientUsername || recipientEmail,
            subject,
            body,
        });
        await newEmail.save();

        // Send actual email using nodemailer for external recipients
        if (recipientEmail) {
            const emailSent = await sendEmail(emailAddress, subject, body);
            if (!emailSent) {
                return res.status(500).json({ message: "Failed to send external email." });
            }
        }

        res.status(200).json({ message: "Email sent successfully." });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const inbox = async (req, res) => {
    const userId = req.user?.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const emails = await Email.find({ recipient: user.userName }).populate(
            "sender",
            "userName email"
        );

        res.status(200).json(emails);
    } catch (error) {
        console.error("Error fetching emails:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};