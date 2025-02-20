import {
  save,
  fetch,
  deleteById,
  fetchById,
  update,
  countEmployee,
} from "../services/employee.js";
import { statusCodes, messages } from "../common/constant.js";

export const create = async (req, res) => {
  try {
    const employeeResponse = await save(req);
    res.status(statusCodes.ok).json(employeeResponse);
  } catch {
    res.status(statusCodes.internalServerError).json({
      message: messages.data_add_error,
    });
  }
};

export const fetch_employee = async (req, res) => {
  try {
    const employeeResponse = await fetch(req);
    if (employeeResponse.length !== 0) {
      res.status(statusCodes.ok).json(employeeResponse);
    }
  } catch {
    res
      .status(statusCodes.internalServerError)
      .json({ message: messages.fetching_failed });
  }
};

export const fetchById_employee = async (req, res) => {
  try {
    const id = req?.params?.id;
    const employee = await fetchById(id);
    if (!employee) {
      return res
        .status(statusCodes.notFound)
        .json({ message: messages.data_not_found });
    }
    return res.status(statusCodes.ok).json(employee);
  } catch (error) {
    return res
      .status(statusCodes.internalServerError)
      .json({ message: messages.fetching_failed, error: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  const id = req?.params?.id;
  if (!id) {
    return res.status(statusCodes.badRequest).json(messages.required);
  }
  const updateData = req?.body;
  try {
    const updatedEmployee = await update(id, updateData);
    if (!updatedEmployee) {
      return res
        .status(statusCodes.notFound)
        .json({ message: messages.not_found });
    }
    return res.status(statusCodes.ok).json(updatedEmployee);
  } catch {
    return res.status(statusCodes.internalServerError).json({
      message: messages.data_update_error,
    });
  }
};

export const deleteEmployee = async (req, res) => {
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
    res
      .status(statusCodes.internalServerError)
      .json({ message: messages.bad_request });
  }
};

export const getEmployeeCount = async (req, res) => {
  try {
    const employeeCount = await countEmployee(req);
    if (employeeCount === 0) {
      return res.status(statusCodes.ok).json({
        success: true,
        message: messages.data_not_found,
        count: 0,
      });
    }

    res.status(statusCodes.ok).json({
      success: true,
      message: messages.fetching_success,
      count: employeeCount,
    });
  } catch {
    res.status(statusCodes.internalServerError).json({
      success: false,
      message: messages.fetching_failed,
    });
  }
};
