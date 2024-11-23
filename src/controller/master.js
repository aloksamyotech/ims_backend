import { fetch , update} from "../services/master.js";
import { statusCodes , messages} from "../common/constant.js";

export const fetchAdmin = async (req, res) => {
  try {
    const adminResponse = await fetch(req);
    if (!adminResponse) {
      return res.status(statusCodes.notFound).json({ message: messages.data_not_found });
    }
    res.status(statusCodes.ok).json(adminResponse); 
  } catch (error) {
    res.status(statusCodes.internalServerError).json({ error: error.message });
  }
};

  export const updateAdmin = async (req, res) => {
    const id  = req?.params?.id; 
    if (!id) {
      return res.status(statusCodes.badRequest).json({ message:messages.required });
    }
    const updateData = req?.body; 
    try {
      const response = await update(id, updateData);
      if (!response) {
        return res.status(statusCodes.notFound).json({ message: messages.not_found });
      }
      return res.status(statusCodes.ok).json(response);
    } catch (error) {
      return res.status(statusCodes.internalServerError).json({ 
        message : messages.fetching_failed
      });
    }
  };