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
  try {
    const { currencyCode, currencySymbol } = req.body;
    const logo = req.file ? req.file.path : null;

    const updateData = {
      currencyCode,
      currencySymbol,
      logo,
    };
    const updatedAdmin = await update(updateData);
    return res.status(statusCodes.ok).json(updatedAdmin);
  } catch (error) {
    return res.status(statusCodes.internalServerError).json({
      message: error.message || messages.fetching_failed, 
    });
  }
};

