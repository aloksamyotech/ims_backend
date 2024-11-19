import express from 'express';
const orderRouter = express.Router();
import * as OrderController from '../controller/orders.js'; 

orderRouter.post("/save", OrderController.create);
orderRouter.get("/fetch",OrderController.fetch_order);
orderRouter.get("/fetchById/:id",OrderController.fetchById_order);
orderRouter.delete("/deleteById/:id",OrderController.deleteOrder);
orderRouter.get("/fetchCustomerProductReport", OrderController.getCustomerProductReport);
orderRouter.patch("/update-status/:id", OrderController.updateOrderStatus);  

export default orderRouter;

