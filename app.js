import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv/config";
import { connectDb } from "./src/common/connection.js";
import categoryRouter from "./src/routes/category.js";
import unitRouter from "./src/routes/unit.js";
import userRouter from "./src/routes/user.js";
import supplierRouter from "./src/routes/supplier.js";
import customerRouter from "./src/routes/customer.js";
import productRouter from "./src/routes/product.js";
import orderRouter from "./src/routes/orders.js";
import purchaseRouter from "./src/routes/purchase.js";
import adminRouter from "./src/routes/master.js";
import subscriptionRouter from "./src/routes/subscription.js";
import employeeRouter from './src/routes/employee.js';
import empPermissionRouter from "./src/routes/empPermissions.js";
import chatbotRouter from "./src/routes/chatbot.js";

import customCron from "./src/common/cron.js";


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use("/api/uploads", express.static( 'uploads'));
app.use("/api/category", categoryRouter);
app.use("/api/unit", unitRouter);
app.use("/api/user", userRouter);
app.use("/api/supplier", supplierRouter);
app.use("/api/customer", customerRouter);
app.use("/api/product", productRouter);  
app.use("/api/order", orderRouter);
app.use("/api/purchase", purchaseRouter);
app.use("/api/admin", adminRouter);
app.use("/api/subscription", subscriptionRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/permissions" , empPermissionRouter);
app.use("/api/ai" , chatbotRouter);

connectDb();
const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server is listening on port :", port);
});

customCron.sendEmailAllUser();
