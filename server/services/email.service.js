import nodemailer from "nodemailer";
import ErrorHandler from "../middlewares/error.js";

// Uses a test account or process.env configuration
export const sendEmailService = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.mailtrap.io",
      port: process.env.SMTP_PORT || 2525,
      auth: {
        user: process.env.SMTP_USER || "test_user",
        pass: process.env.SMTP_PASS || "test_pass",
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL || '"JobZee" <noreply@jobzee.com>',
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Email Service Error:", error);
    throw new ErrorHandler("Email could not be sent", 500);
  }
};
