import mongoose from "mongoose";
import { tableNames } from "../common/constant.js";
import UserSchemaModel from "./user.js";

const CustomerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: tableNames.users,
      required: true,
    },
    customernm: {
      type: String,
      required: function () {
        return this.isWholesale === true;
      },
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: Number,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: function () {
        return this.isWholesale === true; 
      },
      trim: true,
    },
    isWholesale: {
      type: Boolean,
      default: true, 
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CustomerSchema.pre("save",async function (next) {
  try {
  if (this.userId) {
    const user = await UserSchemaModel.findById(this.userId);
    if (!user) {
      return next(new Error("User not found"));
    }
    this.userId = user?._id;
  }
  next();
} catch (error) {
  next(error);
}
});

const CustomerSchemaModel = mongoose.model(tableNames.customer, CustomerSchema);

export default CustomerSchemaModel;
