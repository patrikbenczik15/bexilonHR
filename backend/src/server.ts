import express from "express";
import connectDB from "./db/db.ts";
import dotenv from "dotenv";
import {
  userRoutes,
  documentRoutes,
  documentTypeRoutes,
  documentRequestTypeRoutes,
  documentRequestRoutes,
  authRoutes,
} from "./routes/index.ts";

dotenv.config();
// TODO how are images stored in db?
const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/document-types", documentTypeRoutes);
app.use("/api/document-request-types", documentRequestTypeRoutes);
app.use("/api/document-requests", documentRequestRoutes);
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("Hello World from bexilonHR backend!");
});

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch(error => {
    if (error.name === "MongoServerError") {
      switch (error.code) {
        case 18:
          console.error("Authentication failed: Invalid username/password.");
          break;
        case 13:
          console.error("Authorization failed: User lacks permissions.");
          break;
        default:
          console.error("MongoDB error:", error.message);
      }
    } else {
      console.error("Connection error:", error.message);
    }

    process.exit(1); // * stop process on error
  });
