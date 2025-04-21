import express from "express";
import connectDB from "./db/db.js";
import dotenv from "dotenv";
import userRoutes from "./routes/UserRoute.js";

dotenv.config();
// TODO how are images stored in db?
const app = express();

app.use(express.json());

app.use("/users", userRoutes);
app.get("/", (req, res) => {
  res.send("Hello World!");
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

connectDB().then(() => {
  app.listen(3000, () => {
    console.log("Server open on port 3000");
  });
});
