import ProductSchemaModel from "../models/products.js";

export const getProductQuantityByName = async (productnm, userId) => {
  try {
    const product = await ProductSchemaModel.findOne({
      productnm: productnm,
      userId: userId,
    });

    if (!product) {
      throw new Error(`Product ${productnm} not found`);
    }

    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};
