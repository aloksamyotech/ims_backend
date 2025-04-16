import express from "express";
const categoryRouter = express.Router();
import * as CategoryController from "../controller/category.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

categoryRouter.post("/save",authenticateJWT, CategoryController.create);
categoryRouter.get("/fetch",authenticateJWT, CategoryController.fetch_category);
categoryRouter.patch("/update/:id",authenticateJWT, CategoryController.updateCategory);
categoryRouter.delete("/deleteById/:id",authenticateJWT,CategoryController.deleteCategory);

export default categoryRouter;
