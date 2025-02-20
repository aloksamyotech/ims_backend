import express from "express";
import * as SubscriptionController from "../controller/subscription.js";
const subscriptionRouter = express.Router();

subscriptionRouter.post("/save", SubscriptionController.create);
subscriptionRouter.get("/fetch", SubscriptionController.fetch_subscription);
subscriptionRouter.patch(
  "/update/:id",
  SubscriptionController.updatedSubscription,
);
subscriptionRouter.get(
  "/fetchById/:id",
  SubscriptionController.fetchById_subsription,
);
subscriptionRouter.get("/count", SubscriptionController.getSubscriptionCount);
subscriptionRouter.delete(
  "/deleteById/:id",
  SubscriptionController.deleteSubscription,
);

export default subscriptionRouter;
