import express from 'express';
const productRouter = express.Router();
import * as ProductController from '../controller/product.js'; 
import { upload } from '../common/upload_multer.js';

productRouter.post("/save", upload,ProductController.create);
productRouter.get("/fetch",ProductController.fetch_product);
productRouter.patch("/update/:id", ProductController.updateProduct);
productRouter.delete("/deleteById/:id",ProductController.deleteProduct);

export default productRouter;

