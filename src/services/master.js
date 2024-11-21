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
  