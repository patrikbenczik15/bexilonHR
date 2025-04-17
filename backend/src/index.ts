import express from "express";

const app = express();

app.get("/", (_req, res) => {
  res.send("Hello from Bexilon backend 👋");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
console.log("HELLO FROM TS WITH LIVE RELOAD SUPA HOT BOY");
