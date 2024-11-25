import express from 'express';
const purchaseRouter = express.Router();
import * as PurchaseController from '../controller/purchase.js'; 

purchaseRouter.post("/save", PurchaseController.create);
purchaseRouter.get("/fetch", PurchaseController.fetch_purchase);
purchaseRouter.get("/fetchById/:id", PurchaseController.fetchById_purchase);
purchaseRouter.delete("/deleteById/:id", PurchaseController.deletePurchase);
purchaseRouter.get("/fetchSupplierProductReport", PurchaseController.getSupplierProductReport);
purchaseRouter.get("/count", PurchaseController.getPurchaseCount);  
purchaseRouter.patch("/update-status/:id", PurchaseController.updatePurchaseStatus); 

export default purchaseRouter;
