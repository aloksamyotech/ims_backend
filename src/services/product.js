import ProductSchemaModel from "../models/products.js";
import { image_url, messages, tableNames } from "../common/constant.js";
import CategorySchemaModel from "../models/category.js";
import mongoose from "mongoose";
import UserSchemaModel from "../models/user.js";

export const save = async (req) => {
  try {
    const {
      productnm,
      buyingPrice,
      sellingPrice,
      quantity,
      quantityAlert,
      tax,
      margin,
      notes,
      categoryId,
      userId,
      avgCost,
    } = req?.body;

    const category = await CategorySchemaModel.findById(categoryId);
    if (!category) {
      throw new Error(messages.data_not_found);
    }

    const user = await UserSchemaModel.findById(userId);
    if (!user) {
      throw new Error(messages.data_not_found);
    }

    const productModel = new ProductSchemaModel({
      productnm,
      buyingPrice,
      sellingPrice,
      quantity,
      quantityAlert,
      tax,
      margin,
      notes,
      categoryId: category._id,
      categoryName: category.catnm,
      image: req.file ? req.file.path : null,
      userId,
      avgCost,
    });
    return await productModel.save();
  } catch (error) {
    throw new Error(messages.data_add_error, error);
  }
};

export const bulkUploadProducts = async (req) => {
  const { productsData } = req?.body;

  try {
 
    const savedProducts = [];

    for (const product of productsData) {
      const { userId,productnm, buyingPrice, sellingPrice, quantity, quantityAlert, tax, margin, notes, categoryId, categoryName, avgCost } = product;

      let category;

      if (categoryId) {
        category = await CategorySchemaModel.findById(categoryId);
      }

      if (!category && categoryName) {
        category = await CategorySchemaModel.findOne({ catnm: categoryName });
      }

      if (!category) {
        category = new CategorySchemaModel({
          catnm: categoryName,
          userId,
        });
        await category.save();
      }

      const productWithUserId = {
        ...product,
        userId, 
        categoryId: category._id,
        categoryName: category.catnm,
      };

      const productModel = new ProductSchemaModel(productWithUserId);
      const savedProduct = await productModel.save();
      savedProducts.push(savedProduct);
    }

    return savedProducts;
  } catch (error) {
    throw new Error(messages.data_update_error , error.message);
  }
};

export const fetch = async (req) => {
  try {
    const { userId } = req?.query;
    const condition_obj = { isDeleted: false };

    if (userId) {
      condition_obj.userId = new mongoose.Types.ObjectId(userId);
    }

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

export const lowStockProducts = async (req) => {
  try {
    const { userId } = req?.query;
    if (!userId) {
      throw new Error("userId is required");
    }
    const outofStock = await ProductSchemaModel.find({
      quantity: { $lt: 5 },
      userId: userId,
    });
    return outofStock;
  } catch (error) {
    throw new Error(messages.fetching_failed + error.message);
  }
};

export const notifyQuantityAlert = async (userId, quantityAlert) => {
  try {
    if (!userId) {
      throw new Error("userId is required");
    }

    const lowStockProducts = await ProductSchemaModel.find({
      userId: userId,
      quantity: { $lt: quantityAlert },
    });

    return lowStockProducts;
  } catch (error) {
    throw new Error(messages.fetching_failed + error.message);
  }
};

export const updateAvgCost = async (productId, qty, price) => {
  try {
    const product = await ProductSchemaModel.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    if (product.avgCost === 0) {
      product.avgCost = price;
    } else {
      const preValuation = product.quantity * product.avgCost;
      const currentValuation = qty * price;

      const totalValuation = preValuation + currentValuation;

      const totalQuantity = product.quantity + qty;

      product.avgCost = (totalValuation / totalQuantity).toFixed(12);
    }
    product.quantity += qty;
    await product.save();

    return product;
  } catch (error) {
    throw new Error("Error updating average cost");
  }
};

