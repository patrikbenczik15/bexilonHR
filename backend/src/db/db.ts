import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbUser = process.env.MONGODB_USER;
const dbPassword = process.env.MONGODB_PASSWORD;
const dbHost = process.env.MONGODB_HOST || "localhost";
const dbPort = process.env.MONGODB_PORT || "27017";
const dbName = process.env.MONGODB_DBNAME || "bexilon";
const dbAuthSource = process.env.MONGODB_AUTH_SOURCE
  ? `?authSource=${process.env.MONGODB_AUTH_SOURCE}`
  : "";

if (!dbUser || !dbPassword) {
  console.error(
    "Error connecting to MongoDB: Missing MONGODB_USER or MONGODB_PASSWORD in .env file."
  );
  process.exit(1);
}

const dbURI = `mongodb://${encodeURIComponent(dbUser)}:${encodeURIComponent(
  dbPassword
)}@${dbHost}:${dbPort}/${dbName}${dbAuthSource}`;

export const connectDB = async () => {
  await mongoose.connect(dbURI);
};

export default connectDB;
