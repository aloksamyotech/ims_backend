import express from 'express';
import * as CustomerController from '../controller/customer.js'; 
import { authenticateJWT } from "../middleware/authMiddleware.js";

const customerRouter = express.Router();

customerRouter.post("/save",authenticateJWT, CustomerController.create)
customerRouter.get("/fetch",authenticateJWT,CustomerController.fetch_customer);
customerRouter.patch("/update/:id",authenticateJWT, CustomerController.updateCustomer);
customerRouter.get("/fetchById/:id",authenticateJWT, CustomerController.fetchById_customer);
customerRouter.get("/count",authenticateJWT, CustomerController.getCustomerCount);
customerRouter.delete("/deleteById/:id",authenticateJWT,CustomerController.deleteCustomer);

export default customerRouter;

