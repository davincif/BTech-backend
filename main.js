import * as dotenv from "dotenv";
dotenv.config();
import express from "express";

const app = express();

app.get("/", function (req, res) {
  res.send("Lock'n'load, sir! 🤖");
  console.info("Lock'n'load, sir! 🤖");
});

const server = app.listen(process.env.PORT);
server.on("listening", () => {
  console.info(`🪖 Captan! Waiting orders on port ${process.env.PORT} 🫡`);
});
