import express from 'express';
import * as EmpPermissionController from '../controller/empPermissions.js'; 
import { authenticateJWT } from "../middleware/authMiddleware.js";

const empPermissionRouter = express.Router();

empPermissionRouter.post("/save",authenticateJWT, EmpPermissionController.setPermissions)
empPermissionRouter.get('/fetch/:empId', authenticateJWT,EmpPermissionController.getEmpPermissions);

export default empPermissionRouter;