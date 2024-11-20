import express from "express";
import * as SupplierController from "../controller/supplier.js";
const supplierRouter = express.Router();

supplierRouter.post("/save", SupplierController.create);
supplierRouter.get("/fetch", SupplierController.fetch_supplier);
supplierRouter.patch("/update/:id", SupplierController.updateSupplier);
supplierRouter.get("/fetchById/:id", SupplierController.fetchById_supplier);
supplierRouter.delete("/deleteById/:id",SupplierController.deleteSupplier);

export default supplierRouter;
