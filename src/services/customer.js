import { messages } from "../common/constant.js";
import CustomerSchemaModel from "../models/customer.js";
import UserSchemaModel from "../models/user.js";

export const save = async (req) => {
  try {
    const {
      customernm,
      email,
      phone,
      address,
      isWholesale,
      userId,
    } = req?.body;

    const user = await UserSchemaModel.findById(userId);
    if (!user) {
      throw new Error(messages.data_not_found);
    }
    const customerModel = new CustomerSchemaModel({
      customernm,
      email,
      phone,
      address,
      isWholesale,
      userId
    });

    return await customerModel.save();
  } catch (error) {
    return error;
  }
};

export const fetch = async (req) => {
  try {
    const { userId, isWholesale } = req?.query; 
    const condition_obj = { isDeleted: false }; 

    if (userId) {
      condition_obj.userId = userId;
    }

    if (isWholesale !== undefined) {
      condition_obj.isWholesale = isWholesale; 
    }

    const customersList = await CustomerSchemaModel.find(condition_obj);

    return customersList;
  } catch (error) {
    throw new Error(messages.fetching_failed);
  }
};


export const fetchById = async (id) => {
  try {
    return await CustomerSchemaModel.findById(id);
  } catch (error) {
    throw new Error(messages.fetching_failed);
  }
};

export const update = async (id, updateData) => {
  try {
    const updatedCustomer = await CustomerSchemaModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (!updatedCustomer || updatedCustomer.isDeleted) {
      throw new Error(messages.data_not_found);
    }
    return updatedCustomer;
  } catch (error) {
    throw new Error(messages.data_update_error);
  }
};

export const deleteById = async (id) => {
  const customer = await CustomerSchemaModel.findById(id);
  if (!customer) {
    throw new Error(messages.data_not_found);
  }
  customer.isDeleted = true;
  return await customer.save();
};

export const countCustomer = async (req) => {
  try {
    const { userId } = req?.query;
    if (!userId) {
      throw new Error("userId is required");
    }
    const condition_obj = { isDeleted: false }; 

    if (userId) {
      condition_obj.userId = userId;
    }

    const customerCount = await CustomerSchemaModel.find(condition_obj);

    if (customerCount === 0) {
      return { message: messages.data_not_found};
    }

    return customerCount.length;
  } catch (error) {
    throw new Error(messages.data_not_found);
  }
};





