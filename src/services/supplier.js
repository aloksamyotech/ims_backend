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
      bankName,
      accountHolder,
      accountNumber,
      userId
    } = req?.body;
    const user = await UserSchemaModel.findById(userId);
    if (!user) {
      throw new Error(messages.data_not_found);
    }
    const supplierModel = new SupplierSchemaModel({
      suppliernm,
      email,
      phone,
      address,
      typeOfSupplier,
      shopName,
      bankName,
      accountHolder,
      accountNumber,
      userId
    });
    return await supplierModel.save();
  } catch (error) {
    throw new Error(messages.data_add_error);
  }
};

export const fetch = async (req) => {
  try {
    const condition_obj = req?.query;
    const suppliersList = await SupplierSchemaModel.find({
      ...condition_obj,
      isDeleted: false,
    });
    return suppliersList;
  } catch (error) {
    throw new Error(messages.fetching_failed);
  }
};

export const fetchById = async (id) => {
  try {
    return await SupplierSchemaModel.findById(id);
  } catch (error) {
    throw new Error(messages.fetching_failed);
  }
};

export const update = async (id, updateData) => {
  try {
    const updatedSupplier = await SupplierSchemaModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (!updatedSupplier || updatedSupplier.isDeleted) {
      throw new Error(messages.data_not_found);
    }
    return updatedSupplier;
  } catch (error) {
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
    const supplierCount = await SupplierSchemaModel.countDocuments({ isDeleted: false });
    if (supplierCount === 0) {
      return 0;
    }
    return supplierCount;
  } catch (error) {
    throw new Error(messages.data_not_found);
  }
};