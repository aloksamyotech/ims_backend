import express from 'express';
import * as CustomerController from '../controller/customer.js'; 
const customerRouter = express.Router();

customerRouter.post("/save", CustomerController.create)
customerRouter.get("/fetch",CustomerController.fetch_customer);
customerRouter.patch("/update/:id", CustomerController.updateCustomer);
customerRouter.get("/fetchById/:id", CustomerController.fetchById_customer);
customerRouter.get("/count", CustomerController.getCustomerCount);
customerRouter.delete("/deleteById/:id",CustomerController.deleteCustomer);

export default customerRouter;

