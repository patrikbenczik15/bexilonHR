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

app.use("/users", userRoutes);
app.use("/documents", documentRoutes);
app.use("/document-types", documentTypeRoutes);
app.use("/document-request-types", documentRequestTypeRoutes);
app.use("/document-requests", documentRequestRoutes);
app.use("/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("Hello World from bexilonHR backend!");
});

// ! test auth endpoint
// app.post("/api/login", async (req, res: any) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Email and password are required" });
//     }

//     // Caută utilizatorul după email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     res.status(200).json({
//       message: "Login successful",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

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
