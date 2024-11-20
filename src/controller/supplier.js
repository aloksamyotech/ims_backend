import { save, fetch, update, deleteById , fetchById} from '../services/supplier.js';
import { statusCodes, messages } from '../common/constant.js';

export const create = async (req, res) => {
  try {
    const supplierResponse = await save(req);
    res.status(statusCodes.created).json(supplierResponse); 
  } catch (error) {
    res.status(statusCodes.internalServerError).json({
      message: messages.data_add_error,
      error: error.message
    });
  }
};

export const fetch_supplier = async (req, res) => {
  try {
    const supplierResponse = await fetch(req);
    if (supplierResponse.length === 0) {
      return res.status(statusCodes.notFound).json({ message: messages.data_not_found });
    }
    res.status(statusCodes.ok).json(supplierResponse);
  } catch (error) {
    res.status(statusCodes.internalServerError).json({
      message: messages.fetching_failed,
      error: error.message
    });
  }
};

export const updateSupplier = async (req, res) => {
  const id  = req.params.id; 
  if (!id) {
    return res.status(statusCodes.badRequest).json({ message: messages.required });
  }
  const updateData = req.body; 
  try {
    const updatedSupplier = await update(id, updateData);
    if (!updatedSupplier) {
      return res.status(statusCodes.notFound).json({ message: messages.not_found });
    }
    return res.status(statusCodes.ok).json(updatedSupplier);
  } catch (error) {
    return res.status(statusCodes.internalServerError).json({ 
      message: messages.data_update_error, 
      error: error.message 
    });
  }
};

export const fetchById_supplier = async (req, res) => {
  try {
    const id = req.params.id;
    const supplier = await fetchById(id); 
    if (!supplier) {
      return res.status(statusCodes.notFound).json({ message:messages.data_not_found });
    }

    return res.status(statusCodes.ok).json(supplier); 
  } catch (error) {
    return res.status(statusCodes.internalServerError).json({ message: messages.fetching_failed, error: error.message }); 
  }
};

export const deleteSupplier = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(statusCodes.badRequest).json({ message: messages.required });
  }

  try {
    await deleteById(id);
    res.status(statusCodes.ok).json({ message: messages.data_deletion_success });
  } catch (error) {
    if (error.message === messages.not_found) {
      return res.status(statusCodes.notFound).json({ message: messages.data_not_found });
    }
    res.status(statusCodes.internalServerError).json({ 
      message: messages.data_deletion_error, 
      error: error.message 
    });
  }
};
