import EmpPermissionSchemaModel from "../models/empPermissions.js";

export const saveOrUpdate = async (empId, permissions) => {
  let permissionData = await EmpPermissionSchemaModel.findOne({ empId });

  if (permissionData) {
    permissionData.permissions = permissions;
  } else {
    permissionData = new EmpPermissionSchemaModel({ empId, permissions });
  }

  return permissionData.save();
};

export const fetch = async (empId) => {
  return EmpPermissionSchemaModel.findOne({ empId });
};
