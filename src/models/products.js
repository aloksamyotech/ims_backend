import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { tableNames } from "../common/constant.js";
import CategorySchemaModel from "./category.js";
import UserSchemaModel from "./user.js";

const ProductSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: tableNames.users,
      required: true,
    },
    productnm: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    buyingPrice: {
      type: Number,
      required: true,
      trim: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    product_no: {
      type: String,
      unique: true,
    },
    tax: {
      type: Number,
      required: true,
      trim: true,
    },
    margin: {
      type: Number,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: tableNames.pcategory,
      required: true,
    },
    categoryName: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProductSchema.plugin(uniqueValidator);

const generateProductNumber = async () => {
  const lastProduct = await ProductSchemaModel.findOne()
    .sort({ createdAt: -1 })
    .exec();
  const lastProductNumber = lastProduct
    ? parseInt(lastProduct.product_no.split("-")[1])
    : 0;
  const newProductNumber = lastProductNumber + 1;

  return `PC-${String(newProductNumber).padStart(2, "0")}`;
};

ProductSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      this.product_no = await generateProductNumber();
    }

    if (this.categoryId) {
      const category = await CategorySchemaModel.findById(this.categoryId);
      this.categoryName = category ? category.catnm : null;
    }

    if (this.userId) {
      const user = await UserSchemaModel.findById(this.userId);
      if (!user) {
        return next(new Error("User not found"));
      }
      this.userId = user?._id;
    }

    if (this.productnm) {
      this.slug = this.productnm
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\--+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
    }
    next();
  } catch (error) {
    next(error);
  }
});

const ProductSchemaModel = mongoose.model(tableNames.products, ProductSchema);

export default ProductSchemaModel;
