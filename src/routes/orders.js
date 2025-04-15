import express from 'express';
const orderRouter = express.Router();
import * as OrderController from '../controller/orders.js'; 
import { authenticateJWT } from "../middleware/authMiddleware.js";

orderRouter.post("/save",authenticateJWT, OrderController.create);
orderRouter.get("/fetch",authenticateJWT,OrderController.fetch_order);
orderRouter.get("/fetchById/:id",authenticateJWT,OrderController.fetchById_order);
orderRouter.delete("/deleteById/:id",authenticateJWT,OrderController.deleteOrder);
orderRouter.get("/fetchCustomerProductReport",authenticateJWT, OrderController.getCustomerProductReport);
orderRouter.get("/count",authenticateJWT, OrderController.getOrderCount);
orderRouter.get("/total-amount",authenticateJWT, OrderController.getTotalSales);
orderRouter.get("/total-quantity",authenticateJWT, OrderController.getTotalQuantity);
orderRouter.get("/sold-quantity-date",authenticateJWT, OrderController.getQuantityForDate);
orderRouter.get("/sold-sales-date",authenticateJWT, OrderController.getSalesForDate);
orderRouter.get("/total-category", authenticateJWT,OrderController.getTotalCategory);
orderRouter.patch("/update-status/:id",authenticateJWT, OrderController.updateOrderStatus);  
orderRouter.get("/total-profit", authenticateJWT,OrderController.getOrderAmount);
orderRouter.get("/total-sales",authenticateJWT, OrderController.getCompanyTotalSales);

export default orderRouter;

