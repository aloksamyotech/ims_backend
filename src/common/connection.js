import mongoose from "mongoose";
import dotenv from "dotenv/config";
import Admin from '../models/master.js'; 
import UserSchemaModel from "../models/user.js";

const defaultAdmin = {
  name: 'Admin',   
  phone: '9876376321',
  email: 'admin@gmail.com', 
  password: 'admin123', 
  role : 'admin'
};

export const connectDb = async () => {
  try {
    const url = process.env.DBURL;
    mongoose.connect(url);
    console.log("DB connected successfully");
    const adminExists = await Admin.findOne({ role: 'admin' });
    if (!adminExists) {
      const admin = new UserSchemaModel(defaultAdmin);
      await admin.save();
      console.log("admin created successfully");
    }
  } catch (error) {
    console.log("Error connection mongodb" + error);
  }
};
