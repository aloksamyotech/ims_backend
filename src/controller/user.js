import {
  save,
  login,
  update,
  deleteById,
  fetch,
  fetchById,
  changePasswordService,
  updateStatus,
  countCompany
} from "../services/user.js";
import { messages, statusCodes } from "../common/constant.js";

export const create = async (req, res) => {
  try {
    const userResponse = await save(req);
    res.status(statusCodes.ok).json(userResponse);
  } catch (error) {
    res.status(statusCodes.created).json(error);
  }
};

export const fetchUser = async (req, res) => {
  try {
    const userResponse = await fetch(req);
    if (userResponse.length !== 0) {
      res.status(statusCodes.ok).json(userResponse);
    }
  } catch (error) {
    res.status(statusCodes.internalServerError).json(error);
  }
};

export const fetchById_User = async (req, res) => {
  try {
    const id = req?.params?.id;
    const user = await fetchById(id);
    if (!user) {
      return res
        .status(statusCodes.notFound)
        .json({ message: messages.data_not_found });
    }
    return res.status(statusCodes.ok).json(user);
  } catch (error) {
    return res
      .status(statusCodes.internalServerError)
      .json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req?.body;
  const result = await login(email, password);
  console.log("result", result);
  if (result.success) {
    return res
      .status(statusCodes.ok)
      .json({ jwtToken: result.jwtToken, user: result.user });
  } else {
    return res
      .status(statusCodes.unauthorized)
      .json({ message: result.message });
  }
};

export const updateUser = async (req, res) => {
  const id = req?.params?.id;
  if (!id) {
    return res
      .status(statusCodes.badRequest)
      .json({ message: messages.required });
  }
  const updateData = req?.body;
  try {
    const updatedUser = await update(id, updateData);
    if (!updatedUser) {
      return res
        .status(statusCodes.notFound)
        .json({ message: messages.not_found });
    }
    return res.status(statusCodes.ok).json(updatedUser);
  } catch (error) {
    console.log(error);
    return res.status(statusCodes.internalServerError).json({
      message: messages.data_update_error,
    });
  }
};

export const deleteUser = async (req, res) => {
  const id = req?.params?.id;
  if (!id) {
    return res
      .status(statusCodes.badRequest)
      .json({ message: messages.required });
  }
  try {
    await deleteById(id);
    res
      .status(statusCodes.ok)
      .json({ message: messages.data_deletion_success });
  } catch (error) {
    if (error.message === messages.not_found) {
      return res
        .status(statusCodes.notFound)
        .json({ message: messages.data_not_found });
    }
    res.status(statusCodes.internalServerError).json({
      message: messages.data_deletion_error,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req?.body;
    const userId = req?.user?._id;
    const result = await changePasswordService(
      userId,
      currentPassword,
      newPassword
    );

    if (result.success) {
      return res
        .status(statusCodes.ok)
        .json({ success: true, message: result.message });
    } else {
      return res
        .status(statusCodes.notFound)
        .json({ success: false, message: result.message });
    }
  } catch (error) {
    return res
      .status(statusCodes.internalServerError)
      .json({ success: false, message: messages.server_error });
  }
};

export const changeCompanyStatus = async (req, res) => {
  const { id } = req?.params;
  const { isActive } = req?.body;
  try {
    const updatedUser = await updateStatus(id, isActive);
    if (!updatedUser) {
      return res.status(statusCodes.notFound).json({
        message: messages.not_found,
      });
    }
    return res.status(statusCodes.ok).json({ success: true, data: updatedUser });
  } catch (error) {
    return res.status(statusCodes.internalServerError).json({
      message: messages.fetching_failed,
    });
  }
};

export const getCompanyCount = async (req, res) => {
  try {
    const companyCount = await countCompany();
    res.status(statusCodes.ok).json({
      success: true,
      message: messages.fetching_success,
      count: companyCount,
    });
  } catch (error) {
    res.status(statusCodes.internalServerError).json({
      success: false,
      message: messages.fetching_failed,
    });
  }
};