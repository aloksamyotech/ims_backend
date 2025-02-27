import { save , fetch , update , deleteById} from '../services/unit.js';
import { statusCodes, messages } from '../common/constant.js';

export const create = async (req, res) => {
  try {
    const unitResponse = await save(req)
    res.status(statusCodes.ok).json(unitResponse)
  } catch (error) {
    res.status(statusCodes.created).json({
      error: error
    })
  }
}

export const fetch_unit = async (req, res) => {
  try {
    const unitResponse = await fetch(req);
    if (unitResponse.length !== 0) {
      res.status(statusCodes.ok).json(unitResponse);
    };
  }
  catch (error) {
    res.status(statusCodes.internalServerError).json(error);
  }
};

export const updateUnit = async (req, res) => {
  const id = req?.params?.id; 
  const updateData = req?.body; 
  try {
    const updatedUnit = await update(id, updateData);
    if (!updatedUnit) {
      return res.status(statusCodes.notFound).json({ message: messages.not_found });
    }
    return res.status(statusCodes.ok).json(updatedUnit);
  } catch (error) {
    return res.status(statusCodes.internalServerError).json({ message: messages.server_error });
  }
};

export const deleteUnit = async (req, res) => {
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


