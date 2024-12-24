import  PurchaseSchemaModel from "../models/purchase.js";
import OrderSchemaModel from "../models/orders.js";
import { tableNames , messages} from "../common/constant.js";

export const fetchSupplierProductReport = async (req) => {
    try {
      const condition_obj = { ...req?.query , isDeleted: false  };
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
            date: 1,
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
  

  export const fetchCustomerProductReport = async (req) => {
    try {
      const condition_obj = { ...req?.query , isDeleted: false  };
      const pipeline = [
        { $match: condition_obj },
        {
          $lookup: {
            from: tableNames.customer,
            localField: "customerId",
            foreignField: "_id",
            as: "customerData",
          },
        },
        {
          $unwind: {
            path: "$customerData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            date: 1,
            customerId: 1,
            customerName: 1,
            customerEmail: 1,
            customerPhone: 1,
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
  
      return await OrderSchemaModel.aggregate(pipeline);
    } catch (error) {
      throw new Error(messages.fetching_failed + error.message);
    }
  };

  
  
  
 
  
  
  