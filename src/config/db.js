import mongoose from "mongoose";
import { Mongo_Url } from "./enverment.js";

export const connectMongodb = async () => {
  try {
    await mongoose.connect(Mongo_Url);
    console.log("MongoDB Connected!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
