import express from "express";
import * as ChatbotController from "../controller/chatbot.js";
const chatbotRouter = express.Router();

chatbotRouter.post("/get-product-quantity",ChatbotController.getProductQuantity);

export default chatbotRouter;
