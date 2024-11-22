import AdminSchemaModel from "../models/master.js";

export const fetch = async (req) => {
    try {
      const condition_obj = req?.query;
      const adminList = await AdminSchemaModel.find({
        ...condition_obj,
      });
      return adminList;
    } catch (error) {
      return error;
    }
  };

  export const update = async (id, updateData) => {
    try {
        const response = await AdminSchemaModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
        if (!response || response.isDeleted) {
            throw new Error(messages.data_not_found);
        }
        return response;
    } catch (error) {
        throw new Error(messages.data_add_error);
    }
  };
  