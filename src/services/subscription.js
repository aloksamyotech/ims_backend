import { messages } from "../common/constant.js";
import SubscriptionSchemaModel from "../models/subscription.js";

export const save = async (req) => {
  try {
    const { title, desc, amount, discount, noOfDays } = req?.body || {};

    const existingTitle = await SubscriptionSchemaModel.findOne({
      title,
    });

    if (existingTitle) {
      return { message: messages.already_exist };
    }

    const subscriptionModel = new SubscriptionSchemaModel({
      title,
      desc,
      amount,
      discount,
      noOfDays,
    });

    return await subscriptionModel.save();
  } catch (error) {
    return error;
  }
};

export const fetch = async (req) => {
  try {
    const condition_obj = req?.query;
    const subscriptionList = await SubscriptionSchemaModel.find({
      ...condition_obj,
      isDeleted: false,
    }).sort({ createdAt: -1 });
    return subscriptionList;
  } catch (error) {
    return error;
  }
};

export const fetchById = async (id) => {
  try {
    return await SubscriptionSchemaModel.findById(id);
  } catch {
    throw new Error(messages.fetching_failed);
  }
};

export const update = async (id, updateData) => {
  try {
    const updatedSubscription = await SubscriptionSchemaModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );
    return updatedSubscription;
  } catch (error) {
    return error;
  }
};

export const deleteById = async (id) => {
  const subscription = await SubscriptionSchemaModel.findById(id);
  if (!subscription) {
    throw new Error(messages.data_not_found);
  }
  subscription.isDeleted = true;
  return await subscription.save();
};

export const countSubscription = async () => {
  try {
    const subscriptionCount = await SubscriptionSchemaModel.countDocuments({
      isDeleted: false,
    });
    if (subscriptionCount === 0) {
      return 0;
    }
    return subscriptionCount;
  } catch {
    throw new Error(messages.data_not_found);
  }
};
