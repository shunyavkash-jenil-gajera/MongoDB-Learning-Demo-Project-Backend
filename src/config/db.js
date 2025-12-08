import mongoose from "mongoose";

export const connectMongodb = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("MongoDB Connected!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
