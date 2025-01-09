import  PurchaseSchemaModel from "../models/purchase.js";
import { tableNames , messages} from "../common/constant.js";
import SupplierSchemaModel from "../models/supplier.js";
import ProductSchemaModel from "../models/products.js";
import mongoose from "mongoose";
import UserSchemaModel from "../models/user.js";
import { updateAvgCost } from "./product.js";

export const save = async (req) => {
  try {
    const {
      date,
      products, 
      status,
      total,
      subtotal,
      tax,
      supplierId,
      userId
    } = req?.body;

    const supplier = await SupplierSchemaModel.findById(supplierId);
    if (!supplier) {
      throw new Error(messages.data_not_found);
    }

    const user = await UserSchemaModel.findById(userId);
    if (!user) {
      throw new Error(messages.data_not_found);
    }

    const productOrders = [];
    for (const product of products) {
      const dbProduct = await ProductSchemaModel.findById(product.productId); 
      if (!dbProduct) {
        throw new Error(`${messages.data_not_found} ${product.productId}`);
      }

      productOrders.push({
        productId: dbProduct._id,
        productName: dbProduct.productnm,
        categoryName: dbProduct.categoryName,
        quantity: product.quantity,
        price: dbProduct.buyingPrice,
      });
    }

    const purchaseModel = new PurchaseSchemaModel({
      date: new Date(date), 
      products: productOrders,
      status: status || 'pending',
      total,
      subtotal,
      tax,
      userId: userId,
      supplierId: supplier._id,
      supplierName: supplier.suppliernm,
      supplierEmail: supplier.email,
      supplierPhone: supplier.phone,
    });
    return await purchaseModel.save();
  } catch (error) {
    throw new Error(messages.data_add_error + error.message);
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
          from: tableNames.supplier,
          localField: "supplierId",
          foreignField: "_id",
          as: "supplierData",
        },
      },
      {
        $unwind: {
          path: "$supplierData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          date: 1,
          purchase_no: 1,
          status: 1,
          subtotal: 1,
          tax: 1,
          total: 1,
          userId: 1,
          supplierId: 1,
          supplierName: 1,
          supplierEmail: 1,
          supplierPhone: 1,
          products: {
            $map: {
              input: "$products",
              as: "product",
              in: {
                productId: "$$product.productId",
                productName: "$$product.productName",
                categoryName: "$$product.categoryName",
                quantity: "$$product.quantity",
                price: "$$product.price",
              },
            },
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ];
    return await PurchaseSchemaModel.aggregate(pipeline);
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
          from: tableNames.supplier,
          localField: "supplierId",
          foreignField: "_id",
          as: "supplierData",
        },
      },
      {
        $unwind: {
          path: "$supplierData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          date: 1,
          purchase_no: 1,
          status: 1,
          subtotal: 1,
          tax: 1,
          total: 1,
          userId: 1,
          supplierId: 1,
          supplierName: 1,
          supplierEmail: 1,
          supplierPhone: 1,
          products: {
            $map: {
              input: "$products",
              as: "product",
              in: {
                productId: "$$product.productId",
                productName: "$$product.productName",
                categoryName: "$$product.categoryName",
                quantity: "$$product.quantity",
                price: "$$product.price",
              },
            },
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];

    const purchase = await PurchaseSchemaModel.aggregate(pipeline);
    if (!purchase.length) {
      throw new Error(messages.data_not_found);
    }
    return purchase[0]; 
  } catch (error) {
    throw new Error(messages.fetching_failed+ error.message);
  }
};

export const deleteById = async (id) => {
  const purchase = await PurchaseSchemaModel.findById(id);
  if (!purchase) {
    throw new Error(messages.data_not_found);
  }
  purchase.isDeleted = true;
  return await purchase.save(); 
};

export const handlePurchaseStatus = async (id, action) => {
  const updateProductQuantity = async (productId, quantity) => {
    const product = await ProductSchemaModel.findById(productId);
    if (!product) {
      throw new Error(`${messages.data_not_found} ${productId}`);
    }
    product.quantity = (Number(product?.quantity) || 0) + Number(quantity);
    await product.save();
  };

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(messages.invalid_format);
    }

    const purchase = await PurchaseSchemaModel.findById(id);
    if (!purchase) {
      throw new Error(messages.data_not_found);
    }
    if (purchase?.status === 'pending') {
      if (action === 'approve') {
        purchase.status = 'completed';
        for (const product of purchase?.products || []) {
          await updateProductQuantity(product?.productId, product?.quantity); 
          await updateAvgCost(product?.productId, product?.quantity, product?.price); 
        }
      } else if (action === 'cancel') {
        purchase.status = 'cancelled';
      } else {
        throw new Error('Invalid action provided');
      }
    } else {
      throw new Error(messages.invalid_format);
    }

    return await purchase.save();
  } catch (error) {
    throw new Error(error.message || messages.data_add_success + error.message);
  }
};

export const countPurchases = async (req) => {
  try {
    const { userId, fromDate, toDate } = req?.query;

    if (!userId) {
      throw new Error("userId is required");
    }

    const query = {
      isDeleted: false,
      userId: userId,
    };
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      query.createdAt = { $gte: from, $lte: to }; 
    }

    const purchaseCount = await PurchaseSchemaModel.find(query);
    
    if (!purchaseCount || purchaseCount === 0) {
      return { message: messages.data_not_found};
    }

    return purchaseCount.length;
  } catch (error) {
    throw new Error(messages.data_not_found);
  }
};


