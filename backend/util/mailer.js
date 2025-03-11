import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";

// Explicitly specify the path to your .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const EMAIL_USER = process.env.MAIL_USER;
const EMAIL_PASS = process.env.MAIL_PASSWORD;

console.log("EMAIL_USER length:", process.env.MAIL_USER?.length || 0);
console.log("EMAIL_PASS length:", process.env.MAIL_PASSWORD?.length || 0);

if (!EMAIL_USER || !EMAIL_PASS) {
    console.error("ERROR: Email credentials are missing in environment variables!"); 
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (recipient, subject, body) => {
    try {
        await transporter.verify();
        console.log("SMTP connection verified successfully");
    } catch (verifyError) {
        console.error("SMTP connection verification failed:", verifyError);
        return false;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: subject,
        text: body,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};