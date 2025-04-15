import express from 'express';
const purchaseRouter = express.Router();
import * as PurchaseController from '../controller/purchase.js'; 
import { authenticateJWT } from "../middleware/authMiddleware.js";

purchaseRouter.post("/save",authenticateJWT, PurchaseController.create);
purchaseRouter.get("/fetch", authenticateJWT,PurchaseController.fetch_purchase);
purchaseRouter.get("/fetchById/:id",authenticateJWT, PurchaseController.fetchById_purchase);
purchaseRouter.delete("/deleteById/:id",authenticateJWT, PurchaseController.deletePurchase);
purchaseRouter.get("/fetchSupplierProductReport",authenticateJWT, PurchaseController.getSupplierProductReport);
purchaseRouter.get("/count",authenticateJWT, PurchaseController.getPurchaseCount);  
purchaseRouter.patch("/update-status/:id",authenticateJWT, PurchaseController.updatePurchaseStatus); 
purchaseRouter.get("/total-purchase",authenticateJWT, PurchaseController.getCompanyTotalPurchase);

export default purchaseRouter;
