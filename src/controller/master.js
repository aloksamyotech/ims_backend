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

    // If a file is uploaded, get the logo path from the file (assumed 'image' is the field name in the form)
    const logo = req.file ? req.file.path : null;

    // Prepare the data to be updated
    const updateData = {
      currencyCode,
      currencySymbol,
      logo,
    };

    // Call the service to update the admin profile
    const updatedAdmin = await update(updateData);

    // If the admin profile is updated successfully
    return res.status(statusCodes.ok).json(updatedAdmin);
  } catch (error) {
    console.error(error); // Log the error for debugging

    // Send a response with an error message
    return res.status(statusCodes.internalServerError).json({
      message: error.message || messages.fetching_failed, // Provide a custom error message
    });
  }
};

