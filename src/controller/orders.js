import { save , fetch , deleteById , fetchById, handleOrderStatus , countOrders,getCategoryForMonth,getTotalQuantityForDateRange,
   getTotalSalesForMonth ,getTotalSalesForDateRange, getTotalQuantityForMonth , getProfitAndSalesForAllProducts, getTotalSalesForEachCompany} from "../services/orders.js";
import { fetchCustomerProductReport } from "../services/reports.js";
import { statusCodes, messages } from "../common/constant.js";

export const create = async (req, res) => {
  try {
    const orderResponse = await save(req);
    res.status(statusCodes.created).json(orderResponse);
  } catch (error) {
    res.status(statusCodes.internalServerError).json({error: error });
  }
};

export const fetch_order = async (req, res) => {
  try {
    const orderResponse = await fetch(req);
    if (orderResponse.length !== 0) {
      res.status(statusCodes.ok).json(orderResponse);
    }
  } catch (error) {
    res.status(statusCodes.internalServerError).json({
     message : messages.fetching_failed
    });
  }
};

export const fetchById_order = async (req, res) => {
  const id = req?.params?.id;
  try {
    const orderResponse = await fetchById(id); 
    if (!orderResponse) {
      return res.status(statusCodes.notFound).json({ message: messages.data_not_found });
    }
    res.status(statusCodes.ok).json(orderResponse);
  } catch (error) {
    res.status(statusCodes.internalServerError).json({
      message :messages.fetching_failed
    });
  }
};


export const deleteOrder = async (req, res) => {
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
    res.status(statusCodes.internalServerError).json({message: messages.bad_request
    });
  }
};

export const getCustomerProductReport = async (req, res) => {
  try {
    const reportResponse = await fetchCustomerProductReport(req);
      res.status(statusCodes.ok).json(reportResponse);
  } catch (error) {
    console.error(error);
    res.status(statusCodes.internalServerError).json({
      message : messages.fetching_failed
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const id = req?.params?.id;
    const action  = req?.body?.action; 
    const updatedOrder = await handleOrderStatus(id, action); 
    return res.status(statusCodes.ok).json({
      message: messages.data_update_success,
      order: updatedOrder,
    });
  } catch (error) {
    return res.status(statusCodes.internalServerError).json({ message: error.message });
  }
};

export const getOrderCount = async (req, res) => {
  try {
    const orderCount = await countOrders(req);
    if (orderCount === 0) {
      return res.status(statusCodes.ok).json({
        success: true,
        message: messages.data_not_found,
        count: 0,
      });
    }
    res.status(statusCodes.ok).json({
      success: true,
      message: messages.fetching_success,
      count: orderCount,
    });
  } catch (error) {
    res.status(statusCodes.internalServerError).json({
      success: false,
      message: messages.fetching_failed,
    });
  }
};


export const getTotalSales = async (req, res) => {
  try {
    const salesData = await getTotalSalesForMonth(req);
    res.status(statusCodes.ok).json({
      success: true,
      data: salesData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: messages.internalServerError
    });
  }
};

export const getSalesForDate = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    if (!fromDate || !toDate) {
      return res.status(statusCodes.badRequest).json({
        success: false,
        message: "Both fromDate and toDate are required.",
      });
    }

    const salesData = await getTotalSalesForDateRange(req);

    res.status(statusCodes.ok).json({
      success: true,
      data: salesData,
    });
  } catch (error) {
    console.error("Error fetching total quantity for date range:", error);
    res.status(statusCodes.internalServerError).json({
      success: false,
      message: messages.internalServerError,
    });
  }
};

export const getTotalQuantity = async (req, res) => {
  try {
    const salesData = await getTotalQuantityForMonth(req);
    res.status(statusCodes.ok).json({
      success: true,
      data: salesData
    });
  } catch (error) {
    res.status(statusCodes.internalServerError).json({
      success: false,
      message: messages.internalServerError
    });
  }
};

export const getQuantityForDate = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    if (!fromDate || !toDate) {
      return res.status(statusCodes.badRequest).json({
        success: false,
        message: "Both fromDate and toDate are required.",
      });
    }

    const salesData = await getTotalQuantityForDateRange(req);

    res.status(statusCodes.ok).json({
      success: true,
      data: salesData,
    });
  } catch (error) {
    console.error("Error fetching total quantity for date range:", error);
    res.status(statusCodes.internalServerError).json({
      success: false,
      message: messages.internalServerError,
    });
  }
};


export const getTotalCategory = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    if (!fromDate || !toDate) {
      return res.status(statusCodes.badRequest).json({
        success: false,
        message: "Both fromDate and toDate are required.",
      });
    }
    
    const salesData = await getCategoryForMonth(req);
    res.status(statusCodes.ok).json({
      success: true,
      data: salesData
    });
  } catch (error) {
    res.status(statusCodes.internalServerError).json({
      success: false,
      message: messages.internalServerError
    });
  }
};
export const getOrderAmount = async (req, res) => {
  try {
    const userId = req?.query?.userId; 

    if (!userId) {
      return res.status(statusCodes.badRequest).json({
        success: false,
        message: messages.required
      });
    }
    const profit = await getProfitAndSalesForAllProducts(userId);
    res.status(statusCodes.ok).json({
      success: true,
      data: profit
    });
  } catch (error) {
    res.status(statusCodes.internalServerError).json({
      success: false,
      message: messages.internalServerError
    });
  }
};

export const getCompanyTotalSales = async (req, res) => {
  try {
    const totalSalesData = await getTotalSalesForEachCompany(req);
    if (totalSalesData.length === 0) {
      return res.status(statusCodes.notFound).json({ message: "No sales data found for any company." });
    }

    return res.status(statusCodes.ok).json({
      success: true,
      message: "Total sales for each company fetched successfully.",
      data: totalSalesData,
    });
  } catch (error) {
    return res.status(statusCodes.internalServerError).json({
      success: false,
      message: "An error occurred while fetching total sales data.",
      error: error.message || error,
    });
  }
};

