import { saveOrUpdate, fetch } from "../services/empPermissions.js";
import { statusCodes, messages } from "../common/constant.js";

export const setPermissions = async (req, res) => {
  const { empId, permissions } = req?.body || {};

  try {
    await saveOrUpdate(empId, permissions);
    res
      .status(statusCodes.created)
      .json({ message: messages.data_update_success });
  } catch {
    res.status(statusCodes.internalServerError).json({
      message: messages.data_add_error,
    });
  }
};

export const getEmpPermissions = async (req, res) => {
  const { empId } = req?.params || {};

  try {
    const permissionData = await fetch(empId);
    res.status(statusCodes.ok).json(permissionData || { permissions: [] });
  } catch {
    res
      .status(statusCodes.internalServerError)
      .json({ message: messages.fetching_failed });
  }
};
