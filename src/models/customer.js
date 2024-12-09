import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
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
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: Number,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    isWholesale: {
      type: Boolean,
      default: true, 
    },
    accountHolder: {
      type: String,
      trim: true,
    },
    accountNumber: {
      type: Number,
      trim: true,
    },
    bankName: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CustomerSchema.plugin(uniqueValidator);

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
