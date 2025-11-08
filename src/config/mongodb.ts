import mongoose from "mongoose";
import env from "../utils/env";

export const connectDB = async () => {
  console.log("Connecting to MongoDB...");
  try {
    if (!env.MONGODB_URL) {
      throw new Error("MONGODB_URL is not defined");
    }

    await mongoose.connect(env.MONGODB_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
};
