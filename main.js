import * as dotenv from "dotenv";
dotenv.config();
import express from "express";

const app = express();

app.get("/", function (req, res) {
  res.send("Hello World");
});

const server = app.listen(process.env.PORT);
server.on("listening", () => {
  console.log(`🪖 Captan! Waiting orders on port ${process.env.PORT} 🫡`);
});
