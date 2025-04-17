import mongoose from "mongoose";

const dbURI = "mongodb://localhost:27017/bexilonhr";

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("Connected to MongoDB ");
  } catch (error) {
    console.error("Error connceting to DB:", error);
    process.exit(1);
  }
};

export default connectDB;
