import mongoose from "mongoose";
import dotenv from "dotenv/config";
import Admin from '../models/master.js'; 
import UserSchemaModel from "../models/user.js";
import AdminSchemaModel from "../models/master.js";

const defaultAdmin = {
  name: 'Admin',   
  phone: '9876376321',
  email: 'admin@gmail.com', 
  password: 'U2FsdGVkX190xH6IIO9pqFAcuT4mbAisjrCdJkOtWWM=', 
  role : 'admin'
};

export const connectDb = async () => {
  try {
    const url = process.env.DBURL;
    mongoose.connect(url);
    console.log("DB connected successfully");
    const adminExists = await Admin.findOne({ role: 'admin' });
    if (!adminExists) {
      const admin = new AdminSchemaModel(defaultAdmin);
      await admin.save();
      console.log("admin created successfully");
    }
  } catch (error) {
    console.log("Error connection mongodb" + error);
  }
};
