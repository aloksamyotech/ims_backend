import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { tableNames } from "../common/constant.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "employee"],
      default: "user",
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
      default: "/uploads/StockSmart.png"
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator);
const UserSchemaModel = mongoose.model(tableNames.users, userSchema);
export default UserSchemaModel;
