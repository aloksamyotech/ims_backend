import {
  save,
  update,
  fetch,
  deleteById,
  fetchById,
  countSubscription,
} from "../services/subscription.js";
import { statusCodes, messages } from "../common/constant.js";

export const create = async (req, res) => {
  try {
    const subscriptionResponse = await save(req);
    res.status(statusCodes.ok).json(subscriptionResponse);
  } catch {
    res.status(statusCodes.internalServerError).json({
      message: messages.data_add_error,
    });
  }
};

export const fetch_subscription = async (req, res) => {
  try {
    const subscriptionResponse = await fetch(req);
    if (subscriptionResponse.length !== 0) {
      res.status(statusCodes.ok).json(subscriptionResponse);
    }
  } catch {
    res
      .status(statusCodes.internalServerError)
      .json({ message: messages.fetching_failed });
  }
};

export const updatedSubscription = async (req, res) => {
  const id = req?.params?.id;
  const updateData = req?.body;
  try {
    const updatedSubscription = await update(id, updateData);
    if (!updatedSubscription) {
      return res
        .status(statusCodes.notFound)
        .json({ message: messages.not_found });
    }
    return res.status(statusCodes.ok).json(updatedSubscription);
  } catch {
    return res
      .status(statusCodes.internalServerError)
      .json({ message: messages.server_error });
  }
};

export const fetchById_subsription = async (req, res) => {
  try {
    const id = req.params?.id;
    const subscription = await fetchById(id);
    if (!subscription) {
      return res
        .status(statusCodes.notFound)
        .json({ message: messages.data_not_found });
    }
    return res.status(statusCodes.ok).json(subscription);
  } catch (error) {
    return res
      .status(statusCodes.internalServerError)
      .json({ message: messages.fetching_failed, error: error.message });
  }
};

export const deleteSubscription = async (req, res) => {
  const id = req.params?.id;
  if (!id) {
    return res
      .status(statusCodes.badRequest)
      .json({ message: messages.required });
  }
  try {
    await deleteById(id);
    res
      .status(statusCodes.ok)
      .json({ message: messages.data_deletion_success });
  } catch (error) {
    if (error.message === messages.not_found) {
      return res
        .status(statusCodes.notFound)
        .json({ message: messages.data_not_found });
    }
    res
      .status(statusCodes.internalServerError)
      .json({ message: messages.bad_request });
  }
};

export const getSubscriptionCount = async (req, res) => {
  try {
    const subscriptionCount = await countSubscription();
    res.status(statusCodes.ok).json({
      success: true,
      message: messages.fetching_success,
      count: subscriptionCount,
    });
  } catch {
    res.status(statusCodes.internalServerError).json({
      success: false,
      message: messages.fetching_failed,
    });
  }
};
