import nodemailer from "nodemailer";
import { emailConfig } from "./email-config.js";

// Log the direct config (without exposing password)
console.log("Using direct email config:", { 
  user: emailConfig.user, 
  passProvided: !!emailConfig.pass 
});

// Create transporter with direct credentials
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass
  }
});

export const sendEmail = async (recipient, subject, body) => {
  console.log(`Attempting to send email to ${recipient} from ${emailConfig.user}`);
  
  try {
    const info = await transporter.sendMail({
      from: `"Your App" <${emailConfig.user}>`,
      to: recipient,
      subject: subject,
      text: body
    });
    
    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
};