import { save , update , fetch , deleteById , fetchById , countCustomer} from '../services/customer.js';
import { statusCodes, messages } from '../common/constant.js';

export const create = async (req, res) => {
  try {
    const customerResponse = await save(req)
    res.status(statusCodes.ok).json(customerResponse);
  } catch (error) {
    res.status(statusCodes.internalServerError).json({
      message : messages.data_add_error
    })
  }
}

export const fetch_customer = async (req, res) => {
  try {
    const customerResponse = await fetch(req);
    if (customerResponse.length !== 0) {
      res.status(statusCodes.ok).json(customerResponse);
    }
  }
  catch (error) {
    res.status(statusCodes.internalServerError).json({message:messages.fetching_failed});
  }
};


export const updateCustomer = async (req, res) => {
  const id  = req?.params?.id; 
  if (!id) {
    return res.status(statusCodes.badRequest).json(messages.required );
  }
  const updateData = req?.body; 
  try {
    const updatedCustomer = await update(id, updateData);
    if (!updatedCustomer) {
      return res.status(statusCodes.notFound).json({ message: messages.not_found });
    }
    return res.status(statusCodes.ok).json(updatedCustomer);
  } catch (error) {
    return res.status(statusCodes.internalServerError).json({ 
      message: messages.data_update_error
    });
  }
};

export const fetchById_customer = async (req, res) => {
  try {
    const id = req?.params?.id;
    const customer = await fetchById(id); 
    if (!customer) {
      return res.status(statusCodes.notFound).json({ message:messages.data_not_found });
    }
    return res.status(statusCodes.ok).json(customer); 
  } catch (error) {
    return res.status(statusCodes.internalServerError).json({ message: messages.fetching_failed, error: error.message }); 
  }
};

export const deleteCustomer = async (req, res) => {
  const id = req?.params?.id;
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
    res.status(statusCodes.internalServerError).json({message : messages.bad_request});
  }
};

export const getCustomerCount = async (req, res) => {
  try {
    const customerCount = await countCustomer(req);
    if (customerCount === 0) {
      return res.status(statusCodes.ok).json({
        success: true,
        message: messages.data_not_found,
        count: 0,
      });
    }

    res.status(statusCodes.ok).json({
      success: true,
      message: messages.fetching_success,
      count: customerCount,
    });
  } catch (error) {
    console.log(error);
    res.status(statusCodes.internalServerError).json({
      success: false,
      message: messages.fetching_failed,
    });
  }
};





