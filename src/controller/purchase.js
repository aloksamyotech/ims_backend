import { save , fetch , deleteById , fetchById,   handlePurchaseStatus, countPurchases,getTotalPurchaseForEachCompany} from "../services/purchase.js";
import { fetchSupplierProductReport } from "../services/reports.js"; 
import { statusCodes, messages } from "../common/constant.js";

export const create = async (req, res) => {
  try {
    const purchaseResponse = await save(req);
    res.status(statusCodes.created).json(purchaseResponse);
  } catch (error) {
    res.status(statusCodes.internalServerError).json({error: error, });
  }
};

export const fetch_purchase = async (req, res) => {
  try {
    const purchaseResponse = await fetch(req);
    if (purchaseResponse.length !== 0) {
      res.status(statusCodes.ok).json(purchaseResponse);
    }
  } catch (error) {
    console.error(error);
    res.status(statusCodes.internalServerError).json({
      message : messages.fetching_failed
    });
  }
};

export const fetchById_purchase = async (req, res) => {
  const id = req?.params?.id;
  try {
    const purchaseResponse = await fetchById(id); 
    if (!purchaseResponse) {
      return res.status(statusCodes.notFound).json({ message: messages.data_not_found });
    }
    res.status(statusCodes.ok).json(purchaseResponse);
  } catch (error) {
    res.status(statusCodes.internalServerError).json({
      message : messages.fetching_failed
    });
  }
};


export const deletePurchase = async (req, res) => {
  const id = req?.params?.id;
  if (!id) {
    return res.status(statusCodes.badRequest).json({ message: messages.required });
  }
  try {
    await deleteById(id);
    res .status(statusCodes.ok) .json({ message: messages.data_deletion_success });
  } catch (error) {
    if (error.message === messages.not_found) {
      return res .status(statusCodes.notFound) .json({ message: messages.data_not_found });
    }
    res.status(statusCodes.internalServerError).json({message : messages.fetching_failed
    });
  }
};

export const getSupplierProductReport = async (req, res) => {
  try {
    const reportResponse = await fetchSupplierProductReport(req);
      res.status(statusCodes.ok).json(reportResponse);
  } catch (error) {
    res.status(statusCodes.internalServerError).json({
      message : messages.fetching_failed
    });
  }
};

export const updatePurchaseStatus = async (req, res) => {
  try {
    const id = req?.params?.id;
    const action  = req?.body?.action; 
    const updatedPurchase = await handlePurchaseStatus(id, action); 
    return res.status(statusCodes.ok).json({
      message: messages.data_update_success,
      order: updatedPurchase,
    });
  } catch (error) {
    return res.status(statusCodes.internalServerError).json({ message: error.message });
  }
};

export const getPurchaseCount = async (req, res) => {
  try {
    const purchaseCount = await countPurchases(req);
    if (purchaseCount === 0) {
      return res.status(statusCodes.ok).json({
        success: true,
        message: messages.data_not_found,
        count: 0,
      });
    }
    res.status(statusCodes.ok).json({
      success: true,
      message: messages.fetching_success,
      count: purchaseCount,
    });
  } catch (error) {
    res.status(statusCodes.internalServerError).json({
      success: false,
      message: messages.fetching_failed,
    });
  }
};

export const getCompanyTotalPurchase = async (req, res) => {
  try {
    const totalPurchaseData = await getTotalPurchaseForEachCompany(req);
    if (totalPurchaseData.length === 0) {
      return res.status(statusCodes.notFound).json({ message: "No purchase data found for any company." });
    }

    return res.status(statusCodes.ok).json({
      success: true,
      message: "Total purchase for each company fetched successfully.",
      data: totalPurchaseData,
    });
  } catch (error) {
    return res.status(statusCodes.internalServerError).json({
      success: false,
      message: "An error occurred while fetching total purchase data.",
      error: error.message || error,
    });
  }
};

