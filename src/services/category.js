import mongoose from "mongoose";
import { messages } from "../common/constant.js";
import CategorySchemaModel from "../models/category.js";
import UserSchemaModel from "../models/user.js";

export const save = async (req) => {
  let { catnm, desc, userId } = req.body; 
  userId = mongoose.Types.ObjectId(userId)
  try {
    const existingCategory = await CategorySchemaModel.findOne({
      catnm,
      userId,
      isDeleted: false
    });

    if (existingCategory) {
      return { message: messages.already_exist };
    }
    const categoryModel = new CategorySchemaModel({
      catnm,
      desc,
      userId,
    });

    return await categoryModel.save();
  } catch (error) {
    return error;
  }
};

export const bulkSave = async (req) => {
  const { categories, userId } = req?.body;

  try {
    if (!categories || categories.length === 0) {
      return {  message: "No categories provided." };
    }

    const categoriesWithUserId = categories.map(category => ({
      ...category,
      userId, 
    }));

    const existingCategories = await CategorySchemaModel.find({
      catnm: { $in: categoriesWithUserId.map(c => c.catnm) },
      userId,
      isDeleted: false
    }).select('catnm');

    const existingCategoryNames = existingCategories.map(c => c.catnm);
    const newCategories = categoriesWithUserId.filter(c => !existingCategoryNames.includes(c.catnm));

    if (newCategories.length === 0) {
      return { message: "All categories already exist." };
    }

    const savedCategories = await CategorySchemaModel.insertMany(newCategories);

    return savedCategories;
  } catch (error) {
    return {  message: 'An error occurred during bulk upload.' };
  }
};


export const fetch = async (req) => {
  try {
    const { userId } = req?.query; 
    const condition_obj = { isDeleted: false };

    if (userId) {
      condition_obj.userId = userId; 
    }

    return await CategorySchemaModel.find(condition_obj);
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
