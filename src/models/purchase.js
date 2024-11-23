import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { tableNames } from "../common/constant.js";
import ProductSchemaModel from "./products.js";
import SupplierSchemaModel from "./supplier.js";

const ProductOrderSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: tableNames.products,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  categoryName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const PurchaseSchema = new mongoose.Schema(
  {
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: tableNames.supplier,
      required: true,
    },
    supplierName: {
      type:String,
      required:true,
    },
    supplierEmail: {
      type: String,
      required: true,
    },
    supplierPhone: {
      type: Number,
      required: true,
    },
    purchase_no: {
      type: String,
      unique: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed" , "cancelled"],
      default: "pending",
    },
    total: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    products: [ProductOrderSchema],
  },
  { timestamps: true }
);

const generatePurchaseNumber = async () => {
  const lastPurchase = await PurchaseSchemaModel.findOne()
    .sort({ createdAt: -1 })
    .exec();
  const lastPurchaseNumber = lastPurchase
    ? parseInt(lastPurchase.purchase_no.split("-")[1])
    : 0;
  const newPurchaseNumber = lastPurchaseNumber + 1;

  return `PRS-${String(newPurchaseNumber).padStart(4, "0")}`;
};

    PurchaseSchema.pre("save", async function (next) {
      try {
        if (this.isNew) {
          this.purchase_no = await generatePurchaseNumber();
        }
    
        if (this.productId) {
          const product = await ProductSchemaModel.findById(this.productId);
          if (!product) {
            return next(new Error("Product not found"));
          }
          this.productId = product?._id;
          this.productName = product?.productnm;
          this.categoryName = product?.categoryName;
        }
       
        if (this.supplierId) {
          const supplier = await SupplierSchemaModel.findById(this.supplierId);
          if (!supplier) {
            return next(new Error("Supplier not found"));
          }
          this.supplierName = supplier.suppliernm;
          this.supplierEmail = supplier ? supplier.email : null;
          this.supplierPhone = supplier ? supplier.phone : null;
        }

        next();
      } catch (error) {
        next(error);
      }
    });
    

PurchaseSchema.plugin(uniqueValidator);

const PurchaseSchemaModel = mongoose.model(tableNames.purchase, PurchaseSchema);

export default PurchaseSchemaModel;
