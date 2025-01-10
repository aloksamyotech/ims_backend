import express from "express";
const categoryRouter = express.Router();
import * as CategoryController from "../controller/category.js";

categoryRouter.post("/save", CategoryController.create);
categoryRouter.get("/fetch", CategoryController.fetch_category);
categoryRouter.patch("/update/:id", CategoryController.updateCategory);
categoryRouter.delete("/deleteById/:id",CategoryController.deleteCategory);

export default categoryRouter;
