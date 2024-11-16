import ProductSchemaModel from "../models/products.js";
import { messages, tableNames } from "../common/constant.js";
import CategorySchemaModel from "../models/category.js";
import UnitSchemaModel from "../models/unit.js";

export const save = async (req, res) => {
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
      unitId,
    } = req.body;
  
    const category = await CategorySchemaModel.findById(categoryId);
    if (!category) {
      throw new Error(messages.data_not_found);
    }

    const unit = await UnitSchemaModel.findById(unitId);
    if (!unit) {
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
      unitId: unit._id,
      unitName: unit.unitnm,
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
        $lookup: {
          from: tableNames.punit,
          localField: "unitId",
          foreignField: "_id",
          as: "unitData",
        },
      },
      {
        $unwind: {
          path: "$categoryData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$unitData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          imageUrl: {
            $cond: {
              if: { $ne: ["$image", null] },
              then: { $concat: ["http://localhost:4200/", "$image"] }, 
              else: ""  
            }
          }
        }
      },
      { $sort: { createdAt: -1 } },
    ];

   return await ProductSchemaModel.aggregate(pipeline);
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




