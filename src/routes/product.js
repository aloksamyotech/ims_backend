import express from "express";
const productRouter = express.Router();
import * as ProductController from "../controller/product.js";
import { upload } from "../common/upload_multer.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

productRouter.post("/save",authenticateJWT, upload, ProductController.create);
productRouter.post("/bulkUpload",authenticateJWT, ProductController.bulkupload);
productRouter.get("/fetch",authenticateJWT, ProductController.fetch_product);
productRouter.put("/update/:id", authenticateJWT,upload, ProductController.updateProduct);
productRouter.get("/fetchById/:id",authenticateJWT, ProductController.fetchById_product);
productRouter.get("/lowstock",authenticateJWT, ProductController.getLowStockCount);
productRouter.get("/quantityalert",authenticateJWT, ProductController.alertLowStock);
productRouter.delete("/deleteById/:id", authenticateJWT,ProductController.deleteProduct);
productRouter.patch("/handleavgcost", authenticateJWT,ProductController.handlePurchase);

export default productRouter;
