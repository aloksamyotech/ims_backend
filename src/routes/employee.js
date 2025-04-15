import express from 'express';
import * as EmployeeController from '../controller/employee.js'; 
import { authenticateJWT } from "../middleware/authMiddleware.js";

const employeeRouter = express.Router();

employeeRouter.post("/save",authenticateJWT, EmployeeController.create)
employeeRouter.get("/fetch",authenticateJWT,EmployeeController.fetch_employee);
employeeRouter.patch("/update/:id",authenticateJWT, EmployeeController.updateEmployee);
employeeRouter.get("/fetchById/:id",authenticateJWT, EmployeeController.fetchById_employee);
employeeRouter.get("/count",authenticateJWT, EmployeeController.getEmployeeCount);
employeeRouter.delete("/deleteById/:id",authenticateJWT,EmployeeController.deleteEmployee);

export default employeeRouter;