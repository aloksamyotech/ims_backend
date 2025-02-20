import express from "express";
import * as EmployeeController from "../controller/employee.js";
const employeeRouter = express.Router();

employeeRouter.post("/save", EmployeeController.create);
employeeRouter.get("/fetch", EmployeeController.fetch_employee);
employeeRouter.patch("/update/:id", EmployeeController.updateEmployee);
employeeRouter.get("/fetchById/:id", EmployeeController.fetchById_employee);
employeeRouter.get("/count", EmployeeController.getEmployeeCount);
employeeRouter.delete("/deleteById/:id", EmployeeController.deleteEmployee);

export default employeeRouter;
