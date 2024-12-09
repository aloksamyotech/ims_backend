import { messages } from "../common/constant.js";
import CategorySchemaModel from "../models/category.js";
import UserSchemaModel from "../models/user.js";

export const save = async (req) => {
  try {
    const { catnm, desc ,userId } = req?.body;
    const user = await UserSchemaModel.findById(userId);
    if (!user) {
      throw new Error(messages.data_not_found);
    }
    const categoryModel = CategorySchemaModel({
      catnm,
      desc,
      userId,
    });
    return await categoryModel.save();
  } catch (error) {
    return error;
  }
};

export const fetch = async (req) => {
  try {
    const condition_obj = req?.query;
    const categoryList = await CategorySchemaModel.find({...condition_obj, isDeleted: false,});
    return categoryList;
  } catch (error) {
    return error;
  }
};

export const update = async (id, updateData) => {
  try {
    const updatedCategory = await CategorySchemaModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    return updatedCategory;
  } catch (error) {
    return error;
  }
};

export const deleteById = async (id) => {
  const category = await CategorySchemaModel.findById(id);
  if (!category) {
    throw new Error(messages.data_not_found);
  }
  category.isDeleted = true;
  return await category.save();
};
