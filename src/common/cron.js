import cron from "node-cron";
import nodemailer from "nodemailer";
import UserSchemaModel from "../models/user.js";
import OrderSchemaModel from "../models/orders.js";
import PurchaseSchemaModel from "../models/purchase.js";
import PDFDocument from "pdfkit";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import moment from "moment";
import process from "process";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmailAllUser = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const users = await UserSchemaModel.find({ isActive: true });

      if (!users.length) {
        console.log("No active users found to send emails.");
        return;
      }

      const reportsDir = path.resolve(__dirname, "reports");
      await fs.promises.mkdir(reportsDir, { recursive: true });

      for (const user of users) {
        try {
          const startOfDay = new Date();
          startOfDay.setHours(0, 0, 0, 0);
          startOfDay.setMinutes(startOfDay.getMinutes() + 330);

          const endOfDay = new Date();
          endOfDay.setHours(23, 59, 59, 999);
          endOfDay.setMinutes(endOfDay.getMinutes() + 330);

          const orders = await OrderSchemaModel.find({
            userId: user._id,
            createdAt: { $gte: startOfDay, $lte: endOfDay },
          });

          const purchases = await PurchaseSchemaModel.find({
            userId: user._id,
            createdAt: { $gte: startOfDay, $lte: endOfDay },
          });

          const doc = new PDFDocument();
          const sanitizedTimestamp = new Date()
            .toISOString()
            .replace(/:/g, "-");
          const filename = `report_${user._id}_${sanitizedTimestamp}.pdf`;
          const filePath = path.join(reportsDir, filename);

          await new Promise((resolve, reject) => {
            const writeStream = fs.createWriteStream(filePath);

            doc.pipe(writeStream);
            doc
              .fontSize(16)
              .text(`Daily Report for ${user.name}`, { align: "center" });
            doc.moveDown(1);

            const formattedDate = moment().format("MMMM Do YYYY");
            doc.text(`Date: ${formattedDate}`, { align: "left" });
            doc.moveDown(2);

            doc.fontSize(12).text("Orders Report:", { underline: true });
            const tableColumns = [100, 150, 200, 80];
            const headers = [
              "Customer Name",
              "Email",
              "Product Details",
              "Total",
            ];
            let currentY = doc.y + 20;

            function drawRow(y, row) {
              let x = 50;
              row.forEach((text, i) => {
                doc.rect(x, y, tableColumns[i], 25).stroke();
                doc.text(text, x + 5, y + 5, { width: tableColumns[i] - 10 });
                x += tableColumns[i];
              });
            }

            drawRow(currentY, headers);
            currentY += 25;

            orders.forEach((order) => {
              const productDetails = order.products
                .map(
                  (product) =>
                    `${product.productName} (Qty: ${product.quantity}, Price: ${product.price})`,
                )
                .join(", ");

              const row = [
                order.customerName,
                order.customerEmail,
                productDetails,
                order.total.toFixed(2),
              ];
              drawRow(currentY, row);
              currentY += 25;
            });

            doc.moveDown(3);

            doc
              .fontSize(12)
              .text("Purchases Report:", { align: "left", underline: true });
            const purchaseHeaders = [
              "Supplier Name",
              "Email",
              "Product Details",
              "Total",
            ];
            let purchaseCurrentY = doc.y + 20;

            drawRow(purchaseCurrentY, purchaseHeaders);
            purchaseCurrentY += 25;

            purchases.forEach((purchase) => {
              const productDetails = purchase.products
                .map(
                  (product) =>
                    `${product.productName} (Qty: ${product.quantity}, Price: ${product.price})`,
                )
                .join(", ");

              const row = [
                purchase.supplierName,
                purchase.supplierEmail,
                productDetails,
                purchase.total.toFixed(2),
              ];
              drawRow(purchaseCurrentY, row);
              purchaseCurrentY += 25;
            });

            doc.end();

            writeStream.on("finish", resolve);
            writeStream.on("error", reject);
          });

          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Your Daily Order and Purchase Report",
            text: `Hello ${user.name},\n\nPlease find attached your daily order and purchase report.`,
            attachments: [
              {
                filename: filename,
                path: filePath,
                contentType: "application/pdf",
              },
            ],
          };

          await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                reject(error);
              } else {
                resolve(info.response);
              }
            });
          });

          console.log(`Email sent successfully to ${user.email}`);
          fs.unlinkSync(filePath);
        } catch (error) {
          console.error(`Error processing user ${user.email}:`, error);
        }
      }
    } catch (error) {
      console.error("Error in cron job:", error);
    }
  });
};

export default { sendEmailAllUser };
