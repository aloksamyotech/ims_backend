import nodemailer from "nodemailer";
import path from "path";
import dotenv from "dotenv";
import { messages } from "./constant.js";

dotenv.config();

const sendEmail = async (email, invoicePath) => {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
      user: "8879a2001@smtp-brevo.com",
      pass: "jfaA9mPbEFQnhS37",
    },
  });

  const mailOptions = {
    from: "riya.rajputsdbc@gmail.com",
    to: email,
    subject: "Your Invoice for order",
    text: "Thank you for your order! Please find the attached invoice.",
    attachments: [
      {
        filename: path.basename(invoicePath),
        path: invoicePath,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    return messages.data_add_success;
  } catch (error) {
    return error;
  }
};

export default sendEmail;
