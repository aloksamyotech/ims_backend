import { save , fetch , deleteById , fetchById, handleOrderStatus , countOrders,
   getTotalSalesForMonth , getTotalQuantityForMonth , getOrderProfit} from "../services/orders.js";
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

export const getOrderAmount = async (req,res) => {
  try{
    const { id } = req.params; 
    if (!id) {
      return res.status(statusCodes.badRequest).json({
        success: false,
        message: "Order ID is required.",
      });
    }
    const profit = await getOrderProfit(id);
    console.log(profit);
    res.status(statusCodes.ok).json({
      success: true,
      data: profit
    });
  }
  catch(error){
    res.status(statusCodes.internalServerError).json({
      success: false,
      message: messages.internalServerError
    });
  }
};

