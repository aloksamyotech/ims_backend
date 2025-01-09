import { messages } from "../common/constant.js";
import { encryptText } from "../common/helper.js";
import EmployeeSchemaModel from "../models/employee.js";
import UserSchemaModel from "../models/user.js";

export const save = async (req) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      userId,
    } = req?.body;

    const user = await UserSchemaModel.findById(userId);
    if (!user) {
      throw new Error(messages.data_not_found);
    }
    // const encryptedPassword = encryptText(password);
    const employeeModel = new EmployeeSchemaModel({
      name,
      email,
      password ,
      phone,
      address,
      userId
    });

    return await employeeModel.save();
  } catch (error) {
    return error;
  }
};

export const fetch = async (req) => {
  try {
    const { userId } = req?.query; 
    const condition_obj = { isDeleted: false }; 

    if (userId) {
      condition_obj.userId = userId;
    }

    const employeeList = await EmployeeSchemaModel.find(condition_obj);
    return employeeList;
  } catch (error) {
    throw new Error(messages.fetching_failed);
  }
};

export const fetchById = async (id) => {
  try {
    return await EmployeeSchemaModel.findById(id);
  } catch (error) {
    throw new Error(messages.fetching_failed);
  }
};

export const update = async (id, updateData) => {
  try {
    const updatedEmployee = await EmployeeSchemaModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (!updatedEmployee || updatedEmployee.isDeleted) {
      throw new Error(messages.data_not_found);
    }
    return updatedEmployee;
  } catch (error) {
    throw new Error(messages.data_update_error);
  }
};

export const deleteById = async (id) => {
  const employee = await EmployeeSchemaModel.findById(id);
  if (!employee) {
    throw new Error(messages.data_not_found);
  }
  employee.isDeleted = true;
  return await employee.save();
};

export const countEmployee = async (req) => {
  try {
    const { userId } = req?.query;
    if (!userId) {
      throw new Error("userId is required");
    }

    const employeeCount = await EmployeeSchemaModel.find({ 
      isDeleted: false,
      userId: userId 
    });

    if (employeeCount === 0) {
      return { message: messages.data_not_found};
    }

    return employeeCount.length;
  } catch (error) {
    throw new Error(messages.data_not_found);
  }
};





