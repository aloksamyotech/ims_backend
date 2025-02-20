import nodemailer from "nodemailer";
import path from "path";
import dotenv from "dotenv";
import { messages } from "./constant.js";
import process from "process";

dotenv.config();

const sendEmail = async (email, invoicePath) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
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
