import express from 'express';
const productRouter = express.Router();
import * as ProductController from '../controller/product.js'; 
import { upload } from '../common/upload_multer.js';

productRouter.post("/save", upload,ProductController.create);
productRouter.get("/fetch",ProductController.fetch_product);
productRouter.patch("/update/:id", ProductController.updateProduct);
productRouter.get("/fetchById/:id",ProductController.fetchById_product);
productRouter.get("/lowstock",ProductController.getLowStockCount);
productRouter.get("/quantityalert",ProductController.alertLowStock);
productRouter.delete("/deleteById/:id",ProductController.deleteProduct);
productRouter.patch("/handleavgcost",ProductController.handlePurchase);

export default productRouter;

