import mongoose from "mongoose";
import dotenv from "dotenv/config";
import Admin from '../models/master.js'; 

const defaultAdmin = {
  username: 'admin',   
  phone: '9876376321',
  email: 'admin@gmail.com', 
  password: 'admin1234', 
};

export const connectDb = async () => {
  try {
    const url = process.env.DBURL;
    mongoose.connect(url);
    console.log("DB connected successfully");
    const adminExists = await Admin.findOne({ role: 'admin' });
    if (!adminExists) {
      const admin = new Admin(defaultAdmin);
      await admin.save();
    }
  } catch (error) {
    console.log("Error connection mongodb");
  }
};
