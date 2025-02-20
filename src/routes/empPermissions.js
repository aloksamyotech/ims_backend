import express from "express";
import * as EmpPermissionController from "../controller/empPermissions.js";
const empPermissionRouter = express.Router();

empPermissionRouter.post("/save", EmpPermissionController.setPermissions);
empPermissionRouter.get(
  "/fetch/:empId",
  EmpPermissionController.getEmpPermissions,
);

export default empPermissionRouter;
