import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { tableNames } from "../common/constant.js";

const SubscriptionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    noOfDays: {
      type: Number,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      trim: true,
    },
    discount: {
      type: Number,
      trim: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

SubscriptionSchema.plugin(uniqueValidator);

const SubscriptionSchemaModel = mongoose.model(tableNames.subscription, SubscriptionSchema);

export default SubscriptionSchemaModel;
