import { fetch} from "../services/master.js";
import { statusCodes } from "../common/constant.js";

export const fetchAdmin = async (req, res) => {
    try {
      const adminResponse = await fetch(req);
      if (adminResponse.length !== 0) {
        res.status(statusCodes.ok).json(adminResponse);
      }
    } catch (error) {
      res.status(statusCodes.internalServerError).json(error);
    }
  };