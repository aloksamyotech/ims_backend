import mongoose from "mongoose";
import { tableNames } from "../common/constant.js";
import UserSchemaModel from "./user.js";

const EmployeeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: tableNames.users,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
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
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: 'employee', 
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

EmployeeSchema.pre("save", async function (next) {
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

const EmployeeSchemaModel = mongoose.model(tableNames.employee, EmployeeSchema);

export default EmployeeSchemaModel;
