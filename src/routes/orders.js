import express from 'express';
const orderRouter = express.Router();
import * as OrderController from '../controller/orders.js'; 

orderRouter.post("/save", OrderController.create);
orderRouter.get("/fetch",OrderController.fetch_order);
orderRouter.get("/fetchById/:id",OrderController.fetchById_order);
orderRouter.delete("/deleteById/:id",OrderController.deleteOrder);
orderRouter.get("/fetchCustomerProductReport", OrderController.getCustomerProductReport);
orderRouter.get("/count", OrderController.getOrderCount);
orderRouter.get("/total-amount", OrderController.getTotalSales);
orderRouter.get("/total-quantity", OrderController.getTotalQuantity);
orderRouter.get("/sold-quantity-date", OrderController.getQuantityForDate);
orderRouter.get("/sold-sales-date", OrderController.getSalesForDate);
orderRouter.get("/total-category", OrderController.getTotalCategory);
orderRouter.patch("/update-status/:id", OrderController.updateOrderStatus);  
orderRouter.get("/total-profit", OrderController.getOrderAmount);
orderRouter.get("/total-sales", OrderController.getCompanyTotalSales);

export default orderRouter;

