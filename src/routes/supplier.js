import express from "express";
import * as SupplierController from "../controller/supplier.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const supplierRouter = express.Router();

supplierRouter.post("/save",authenticateJWT, SupplierController.create);
supplierRouter.get("/fetch",authenticateJWT, SupplierController.fetch_supplier);
supplierRouter.patch("/update/:id",authenticateJWT, SupplierController.updateSupplier);
supplierRouter.get("/fetchById/:id",authenticateJWT, SupplierController.fetchById_supplier);
supplierRouter.get("/count", authenticateJWT,SupplierController.getSupplierCount);
supplierRouter.delete("/deleteById/:id",authenticateJWT,SupplierController.deleteSupplier);

export default supplierRouter;
