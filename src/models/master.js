import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { tableNames } from "../common/constant.js";

const adminSchema = new mongoose.Schema(
  {
    name: {
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
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: "admin",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    currencyCode: {
      type: String,
      default: "INR",
    },
    currencySymbol: {
      type: String,
      default: "₹",
    },
    logo: {
      type: String,
    },
  },
  { timestamps: true },
);

adminSchema.plugin(uniqueValidator);

const AdminSchemaModel = mongoose.model(tableNames.admin, adminSchema);

export default AdminSchemaModel;
