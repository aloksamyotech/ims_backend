import { save , fetch , update ,deleteById } from "../services/category.js";
import { statusCodes, messages } from "../common/constant.js";

export const create = async (req, res) => {
  try {
    const categoryResponse = await save(req);
    res.status(statusCodes.ok).json(categoryResponse);
  } catch (error) {
    res.status(statusCodes.created).json({
      error: error,
    });
  }
};

export const fetch_category = async (req, res) => {
  try {
    const categoryResponse = await fetch(req);
    if (categoryResponse.length !== 0) {
      res.status(statusCodes.ok).json(categoryResponse);
    }
  } catch (error) {
    res.status(statusCodes.internalServerError).json(error);
  }
};

export const updateCategory = async (req, res) => {
  const id = req?.params?.id;
  const updateData = req?.body; 
  try {
    const updatedCategory = await update(id, updateData);
    if (!updatedCategory) {
      return res.status(statusCodes.notFound).json({ message: messages.not_found });
    }
    return res.status(statusCodes.ok).json(updatedCategory);
  } catch (error) {
    return res.status(statusCodes.internalServerError).json({ message: messages.server_error });
  }
};

export const deleteCategory = async (req, res) => {
  try {
      const id = req?.params?.id;
      await deleteById(id);
      res.status(statusCodes.ok).json({ msg: messages.data_deletion_success });
  } catch (error) {
      if (error.message === messages.not_found) {
          return res.status(statusCodes.notFound).json({ msg: messages.data_not_found });
      }
      res.status(statusCodes.internalServerError).json({ error: error.message });
  }
};


