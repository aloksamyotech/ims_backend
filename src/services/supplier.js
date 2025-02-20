import { messages } from "../common/constant.js";
import SupplierSchemaModel from "../models/supplier.js";
import UserSchemaModel from "../models/user.js";

export const save = async (req) => {
  try {
    const {
      suppliernm,
      email,
      phone,
      address,
      typeOfSupplier,
      shopName,
      userId,
    } = req?.body || {};
    const user = await UserSchemaModel.findById(userId);
    if (!user) {
      throw new Error(messages.data_not_found);
    }

    const existingSupplier = await SupplierSchemaModel.findOne({
      email,
      userId,
      isDeleted: false,
    });

    if (existingSupplier) {
      return { message: messages.already_exist };
    }

    const supplierModel = new SupplierSchemaModel({
      suppliernm,
      email,
      phone,
      address,
      typeOfSupplier,
      shopName,
      userId,
    });

    const savedCustomer = await supplierModel.save();
    return savedCustomer;
  } catch (error) {
    return { error: error.message };
  }
};

export const fetch = async (req) => {
  try {
    const { userId } = req?.query || {};
    const condition_obj = { isDeleted: false };

    if (userId) {
      condition_obj.userId = userId;
    }

    return await SupplierSchemaModel.find(condition_obj).sort({
      createdAt: -1,
    });
  } catch {
    throw new Error(messages.fetching_failed);
  }
};

export const fetchById = async (id) => {
  try {
    return await SupplierSchemaModel.findById(id);
  } catch {
    throw new Error(messages.fetching_failed);
  }
};

export const update = async (id, updateData) => {
  try {
    const updatedSupplier = await SupplierSchemaModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );
    if (!updatedSupplier || updatedSupplier.isDeleted) {
      throw new Error(messages.data_not_found);
    }
    return updatedSupplier;
  } catch {
    throw new Error(messages.data_update_error);
  }
};

export const deleteById = async (id) => {
  const supplier = await SupplierSchemaModel.findById(id);
  if (!supplier) {
    throw new Error(messages.data_not_found);
  }
  supplier.isDeleted = true;
  return await supplier.save();
};

export const countSupplier = async (req) => {
  try {
    const { userId } = req?.query || {};
    if (!userId) {
      throw new Error("userId is required");
    }

    const condition_obj = { isDeleted: false };

    if (userId) {
      condition_obj.userId = userId;
    }

    const supplierCount = await SupplierSchemaModel.find(condition_obj);

    if (supplierCount === 0) {
      return { message: messages.data_not_found };
    }

    return supplierCount.length;
  } catch {
    throw new Error(messages.data_not_found);
  }
};
