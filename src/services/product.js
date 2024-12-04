import ProductSchemaModel from "../models/products.js";
import { image_url, messages, tableNames } from "../common/constant.js";
import CategorySchemaModel from "../models/category.js";
import mongoose from "mongoose";

export const save = async (req) => {
  try {
    const {
      productnm,
      buyingPrice,
      sellingPrice,
      quantity,
      tax,
      margin,
      notes,
      categoryId,
    } = req?.body;

    const category = await CategorySchemaModel.findById(categoryId);
    if (!category) {
      throw new Error(messages.data_not_found);
    }

    const productModel = new ProductSchemaModel({
      productnm,
      buyingPrice,
      sellingPrice,
      quantity,
      tax,
      margin,
      notes,
      categoryId: category._id,
      categoryName: category.catnm,
      image: req.file ? req.file.path : null,
    });
    return await productModel.save();
  } catch (error) {
    throw new Error(messages.data_add_error, error);
  }
};

export const fetch = async (req) => {
  try {
    const condition_obj = { ...req.query, isDeleted: false };

    const pipeline = [
      { $match: condition_obj },
      {
        $lookup: {
          from: tableNames.pcategory,
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: {
          path: "$categoryData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          imageUrl: {
            $ifNull: [{ $concat: [image_url.url, "$image"] }, ""],
          },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ];

    return await ProductSchemaModel.aggregate(pipeline);
  } catch (error) {
    throw new Error(messages.fetching_failed + error.message);
  }
};

export const fetchById = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(messages.invalid_format);
    }
    const condition_obj = { _id: new mongoose.Types.ObjectId(id) };
    const pipeline = [
      { $match: condition_obj },
      {
        $lookup: {
          from: tableNames.pcategory,
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: {
          path: "$categoryData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          imageUrl: {
            $ifNull: [{ $concat: [image_url.url, "$image"] }, ""],
          },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ];
    const product = await ProductSchemaModel.aggregate(pipeline);
    if (!product.length) {
      throw new Error(messages.data_not_found);
    }
    return product[0];
  } catch (error) {
    throw new Error(messages.fetching_failed + error.message);
  }
};

export const update = async (id, updateData) => {
  try {
    const updatedProduct = await ProductSchemaModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (!updatedProduct || updatedProduct.isDeleted) {
      throw new Error(messages.data_not_found);
    }
    return updatedProduct;
  } catch (error) {
    throw new Error(messages.data_update_error + error.message);
  }
};

export const deleteById = async (id) => {
  const product = await ProductSchemaModel.findById(id);
  if (!product) {
    throw new Error(messages.data_not_found);
  }
  product.isDeleted = true;
  await product.save();
  return product;
};

export const lowStockProducts = async () => {
  try {
    const lowStock = await ProductSchemaModel.find({ quantity: { $lt: 5 } });
    return lowStock; 
  } catch (error) {
    throw new Error(messages.data_not_found); 
  }
};

