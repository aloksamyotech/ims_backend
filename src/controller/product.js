import {
  save,
  update,
  fetch,
  deleteById,
  fetchById,
  lowStockProducts,
  notifyQuantityAlert,
  updateAvgCost,
  bulkUploadProducts,
} from "../services/product.js";
import { statusCodes, messages } from "../common/constant.js";

export const create = async (req, res) => {
  try {
    const productResponse = await save(req);
    res.status(statusCodes.created).json(productResponse);
  } catch (error) {
    res.status(statusCodes.internalServerError).json({ error: error });
  }
};

export const bulkupload = async (req, res) => {
  try {
    const result = await bulkUploadProducts(req);
    res.status(statusCodes.ok).json(result);
  } catch (error) {
    res.status(statusCodes.internalServerError).json({ error: error });
  }
};

export const fetch_product = async (req, res) => {
  try {
    const productResponse = await fetch(req);
    if (productResponse.length !== 0) {
      res.status(statusCodes.ok).json(productResponse);
    }
  } catch (error) {
    res.status(statusCodes.internalServerError).json({
      message: messages.fetching_failed,
    });
  }
};

export const fetchById_product = async (req, res) => {
  const id = req?.params?.id;
  try {
    const productResponse = await fetchById(id);
    if (!productResponse) {
      return res
        .status(statusCodes.notFound)
        .json({ message: messages.data_not_found });
    }
    res.status(statusCodes.ok).json(productResponse);
  } catch (error) {
    res.status(statusCodes.internalServerError).json({
      message: messages.fetching_failed,
    });
  }
};

export const updateProduct = async (req, res) => {
  const id = req?.params?.id;
  let image = req.file ? `uploads/${req.file.filename}` : undefined;
  const updateData = req?.body || {};
  delete updateData._id;
  try {
    const updatedProduct = await update(id, updateData, image);
    if (!updatedProduct) {
      return res
        .status(statusCodes.notFound)
        .json({ message: messages.not_found });
    }
    return res
      .status(statusCodes.ok)
      .json({ success: true, data: updatedProduct });
  } catch (error) {
    return res.status(statusCodes.internalServerError).json({
      message: messages.data_update_error,
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
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

export const getLowStockCount = async (req, res) => {
  try {
    const stockCount = await lowStockProducts(req);
    res.status(statusCodes.ok).json({
      success: true,
      message: messages.fetching_success,
      count: stockCount.length,
      data: stockCount,
    });
  } catch (error) {
    res.status(statusCodes.internalServerError).json({
      success: false,
      message: messages.fetching_failed,
    });
  }
};

export const alertLowStock = async (req, res) => {
  try {
    const userId = req?.query?.userId;
    const quantityAlert = parseInt(req?.query?.quantityAlert || "50", 10);

    if (!userId) {
      return res.status(statusCodes.badRequest).json({
        success: false,
        message: "User ID is required",
      });
    }

    const lowStockProducts = await notifyQuantityAlert(userId, quantityAlert);

    if (lowStockProducts == null) {
      return res.status(statusCodes.notFound).json({
        success: false,
        message: messages.data_not_found,
      });
    }

    if (lowStockProducts.length > 0) {
      return res.status(statusCodes.ok).json({
        success: true,
        message: messages.fetching_success,
        data: lowStockProducts,
      });
    } else {
      return res.status(statusCodes.notFound).json({
        success: false,
        message: messages.data_not_found,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(statusCodes.internalServerError).json({
      success: false,
      message: messages.fetching_failed,
    });
  }
};

export const handlePurchase = async (req, res) => {
  try {
    const { productId, qty, price } = req?.body;

    const updatedProduct = await updateAvgCost(productId, qty, price);
    return res.status(statusCodes.ok).json({
      message: messages.data_update_success,
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(statusCodes.internalServerError).json({
      message: messages.data_update_error,
      error: error.message,
    });
  }
};
