import { messages } from "../common/constant.js";
import CustomerSchemaModel from "../models/customer.js";

export const save = async (req) => {
  try {
    const {
      customernm,
      email,
      phone,
      address,
      isWholesale,
      accountHolder,
      accountNumber,
      bankName,
    } = req?.body;

    const customerModel = new CustomerSchemaModel({
      customernm,
      email,
      phone,
      address,
      isWholesale,
      accountHolder,
      accountNumber,
      bankName,
    });

    return await customerModel.save();
  } catch (error) {
    return error;
  }
};

export const fetch = async (req) => {
  try {
    const { isWholesale } = req?.query;
    let customersList;

    if (isWholesale !== undefined) {
      customersList = await CustomerSchemaModel.find({
        isWholesale: isWholesale,
        isDeleted: false,
      });
    } else {
      customersList = await CustomerSchemaModel.find({
        isDeleted: false,
      });
    }
    return customersList;
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
