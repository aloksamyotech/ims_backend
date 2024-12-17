import mongoose from "mongoose";
import { tableNames } from "../common/constant.js";
import UserSchemaModel from "./user.js";

const CategorySchema = new mongoose.Schema(
  {
    catnm: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    desc: {
      type: String,
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: tableNames.users,
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CategorySchema.pre("save", async function (next) {
  try {
    if (this.catnm) {
      this.slug = this.catnm
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\--+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
    }

    if (this.userId) {
      const user = await UserSchemaModel.findById(this.userId);
      if (!user) {
        return next(new Error("User not found"));
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

const CategorySchemaModel = mongoose.model(tableNames.pcategory, CategorySchema);

export default CategorySchemaModel;
