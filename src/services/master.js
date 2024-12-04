import AdminSchemaModel from "../models/master.js";
import { messages , image_url} from "../common/constant.js";

export const fetch = async (req) => {
  try {
    const condition_obj = req?.query;

    const adminList = await AdminSchemaModel.aggregate([
      {
        $match: {
          ...condition_obj, 
        },
      },
      {
        $addFields: {
          logoUrl: {
            $ifNull: [{ $concat: [image_url.url, "$logo"] }, ""],
          },
        },
      },
    ]);

    return adminList;
  } catch (error) {
    console.error(error);
    return error;
  }
};

  export const update = async (updateData) => {
    try {
      const { currencyCode, currencySymbol, logo } = updateData;

      const response = await AdminSchemaModel.findOneAndUpdate(
        {}, 
        { currencyCode, currencySymbol, logo }, 
        { new: true }
      );
  
      if (!response || response.isDeleted) {
        throw new Error(messages.data_not_found); 
      }
      return response;
    } catch (error) {
      console.error(error);
      throw new Error(messages.data_add_error); 
    }
  };
  
  