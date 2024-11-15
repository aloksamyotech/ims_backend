import { save , fetch , deleteById , fetchById} from "../services/orders.js";
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
  const id = req.params.id;
  try {
    const orderResponse = await fetchById(id); 
    if (orderResponse) {
      res.status(statusCodes.ok).json(orderResponse);
    } else {
      res.status(statusCodes.notFound).json({
        message: messages.data_not_found
      });
    }
  } catch (error) {
    res.status(statusCodes.internalServerError).json({
      message :messages.fetching_failed
    });
  }
};


export const deleteOrder = async (req, res) => {
  const id = req.params.id;
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