import express from "express";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload"; 
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
import multer from "multer";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cors());
app.use(express.json());

app.use("/category", categoryRouter);
app.use("/unit", unitRouter);
app.use("/user", userRouter);
app.use("/supplier", supplierRouter);
app.use("/customer", customerRouter);
app.use("/product", productRouter);  
app.use("/order", orderRouter);
app.use("/purchase", purchaseRouter);

connectDb();
const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server is listening on port :", port);
});
