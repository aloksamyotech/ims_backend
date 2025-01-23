import { encryptText, decryptText } from "../common/helper.js";
import UserSchemaModel from "../models/user.js";
import AdminSchemaModel from "../models/master.js";
import EmployeeSchemaModel from "../models/employee.js";
import EmpPermissionSchemaModel from "../models/empPermissions.js";
import jwt from "jsonwebtoken";
import { messages } from "../common/constant.js";
import { testInput } from "../common/nlp/nlp.js";

export const save = async (req) => {
  try {
    const { name, email, password, role, phone } = req?.body;
    const existingUser = await UserSchemaModel.findOne({ email });
    if (existingUser) {
      return { success: false, message: messages.already_registered };
    }
    const encryptedPassword = encryptText(password);
    const userModel = new UserSchemaModel({
      name,
      email,
      password: encryptedPassword,
      phone,
      role,
    });

    return await userModel.save();
  } catch (error) {
    return { error: error.message };
  }
};

export const fetch = async (req) => {
  try {
    const condition_obj = req?.query;
    const usersList = await UserSchemaModel.find({
      ...condition_obj,
    }).sort({ createdAt: -1 });
    return usersList;
  } catch (error) {
    return error;
  }
};

export const fetchById = async (id) => {
  try {
    const user = await UserSchemaModel.findById(id);
    return user;
  } catch (error) {
    throw new Error(messages.fetching_failed + error.message);
  }
};

export const login = async (email, password) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    let user =
      (await UserSchemaModel.findOne({ email: normalizedEmail })) ||
      (await AdminSchemaModel.findOne({ email: normalizedEmail })) ||
      (await EmployeeSchemaModel.findOne({ email: normalizedEmail }));

    if (!user) {
      return { success: false, message: messages.user_not_found };
    }

    if (user instanceof AdminSchemaModel) {
      user.role = "admin";
    } else if (user instanceof EmployeeSchemaModel) {
      user.role = "employee";
    } else if (user instanceof UserSchemaModel) {
      user.role = "user";
    }

    if (user.role === "user") {
      if (!user.isActive) {
        return { success: false, message: messages.account_inactive };
      }
    }

    const decryptedPassword = decryptText(user.password);
    if (password !== decryptedPassword) {
      return { success: false, message: messages.invalid_credentials };
    }

    let payload;

    if (user.role === "employee") {
      const permissionsData = await EmpPermissionSchemaModel.findOne({
        empId: user._id,
      });
      const permissions = permissionsData?.permissions || [];
      payload = {
        _id: user._id,
        userId: user.userId,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        permissions,
      };
    } else if (user.role === "admin" || "user") {
      payload = {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      };
    }

    const jwtToken = jwt.sign(payload, process.env.SECRET);

    return { success: true, jwtToken, user: payload };
  } catch (error) {
    return { success: false, message: messages.server_error };
  }
};

export const update = async (id, updateData) => {
  try {
    const updatedUser = await UserSchemaModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (!updatedUser || updatedUser.isDeleted) {
      throw new Error(messages.data_not_found);
    }
    return updatedUser;
  } catch (error) {
    throw new Error(messages.data_add_error);
  }
};

export const deleteById = async (id) => {
  const user = await UserSchemaModel.findById(id);
  if (!user) {
    throw new Error(messages.data_not_found);
  }
  user.isDeleted = true;
  await user.save();
  return user;
};

export const changePasswordService = async (
  userId,
  currentPassword,
  newPassword
) => {
  try {
    const user = await UserSchemaModel.findById(userId);
    if (!user) {
      return { success: false, message: messages.user_not_found };
    }

    const decryptedPassword = decryptText(user.password);
    if (currentPassword !== decryptedPassword) {
      return { success: false, message: messages.invalid_credentials };
    }

    const encryptedNewPassword = encryptText(newPassword);

    user.password = encryptedNewPassword;
    await user.save();

    return { success: true, message: messages.password_changed_successfully };
  } catch (error) {
    return { success: false, message: messages.server_error };
  }
};

export const updateStatus = async (id, isActive) => {
  try {
    if (typeof isActive !== "boolean") {
      throw new Error("Invalid isActive value. It must be a boolean.");
    }

    const updatedUser = await UserSchemaModel.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!updatedUser || updatedUser.isDeleted) {
      throw new Error(messages.data_not_found);
    }

    return updatedUser;
  } catch (error) {
    throw new Error(messages.data_add_error);
  }
};

export const countCompany = async (req) => {
  try {
    const companyCount = await UserSchemaModel.countDocuments({
      isDeleted: false,
      role: "user",
    });
    if (!companyCount || companyCount === 0) {
      return 0;
    }
    return companyCount;
  } catch (error) {
    throw new Error(messages.data_not_found);
  }
};

export const getAiresponse = async (req) => {
  try {
    const rawtext = req?.body?.text;
    const response = await testInput(rawtext);
    return response;
  } catch (error) {
    throw new Error(messages.data_not_found);
  }
};


