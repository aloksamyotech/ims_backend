import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { tableNames } from "../common/constant.js";

const UnitSchema = new mongoose.Schema(
  {
    unitnm: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    shortcode: {
      type: String,
      required: true,
      trim: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

UnitSchema.plugin(uniqueValidator);

UnitSchema.pre("save", function (next) {
  if (this.unitnm) {
    this.slug = this.unitnm
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }
  next();
});

const UnitSchemaModel = mongoose.model(tableNames.punit, UnitSchema);

export default UnitSchemaModel;
