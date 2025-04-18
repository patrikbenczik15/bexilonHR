import express from "express";
import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";
dotenv.config();

const dbURI = process.env.MONGODB_URI || "";
const app = express();
app.use(express.json());

mongoose
  .connect(dbURI)
  .then(async () => {
    console.log("Connected to MongoDB");

    const existingUser = await User.findOne({
      email: "john.wayne@bexilon.com",
    });

    if (!existingUser) {
      const user = new User({
        name: "John Wayne",
        email: "john.wayne@bexilon.com",
        password: "parolaputernica", // * hashed by pre-save hook
      });

      await user.save();
      console.log("Test user created successfully");
    } else {
      console.log("Test user already exists");
    }
  })
  .catch(error => {
    console.error("Error connecting to MongoDB:", error);
  });

app.get("/", (req, res) => {
  res.send("Hello from bexilonHR backend");
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

app.listen(3000, () => {
  console.log("Server open on port 3000");
});
