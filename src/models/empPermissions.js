import mongoose from "mongoose";
import { tableNames } from "../common/constant.js";
import EmployeeSchemaModel from "./employee.js";

const empPermissionSchema = new mongoose.Schema({
  empId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: tableNames.employee,
    required: true,
  },
  permissions: {
    type: [String],
    default: ['default'], 
  },
});

empPermissionSchema.pre("save", async function (next) {
    try {
      if (this.empId) {
        const employee = await EmployeeSchemaModel.findById(this.empId);
        if (!employee) {
          return next(new Error("Employee not found"));
        }
        this.empId = employee?._id;
      }
      next();
    } catch (error) {
      next(error);
    }
  });

const EmpPermissionSchemaModel= mongoose.model(tableNames.empPermissions, empPermissionSchema);

export default EmpPermissionSchemaModel;
