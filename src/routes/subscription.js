import express from 'express';
import * as SubscriptionController from '../controller/subscription.js'; 
import { authenticateJWT } from "../middleware/authMiddleware.js";

const subscriptionRouter = express.Router();

subscriptionRouter.post("/save",authenticateJWT, SubscriptionController.create)
subscriptionRouter.get("/fetch",authenticateJWT,SubscriptionController.fetch_subscription);
subscriptionRouter.patch("/update/:id",authenticateJWT, SubscriptionController.updatedSubscription);
subscriptionRouter.get("/fetchById/:id",authenticateJWT, SubscriptionController.fetchById_subsription);
subscriptionRouter.get("/count",authenticateJWT, SubscriptionController.getSubscriptionCount);
subscriptionRouter.delete("/deleteById/:id",authenticateJWT,SubscriptionController.deleteSubscription);

export default subscriptionRouter;

