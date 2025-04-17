import express from "express";
import mongoose from "mongoose";
import User from "./models/User.js";
// ! TODO add hashing
const app = express();

const dbURI = "mongodb://localhost:27017/bexilonhr";

mongoose
  .connect(dbURI)
  .then(async () => {
    console.log("Connected to MongoDB");

    // * test user -> need it in order to test MongoDB
    const user = new User({
      name: "John Wayne",
      email: "john.wayne@bexilon.com",
      password: "parolaputernica",
    });

    await user.save();
    console.log("User saved succesfully");
  })
  .catch(error => {
    console.error("Error connecting to MongoDB:", error);
  });

app.get("/", (req, res) => {
  res.send("Hello from bexilonHR backend ");
});

app.listen(3000, () => {
  console.log("Server open on port 3000");
});
