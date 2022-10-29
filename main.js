import * as dotenv from "dotenv";
dotenv.config();
import express from "express";

import { webUserConfigure } from "./ports/webUser.js";

const apiModules = [webUserConfigure];
const app = express();

function init() {
  // loading modules
  for (let apiModule of apiModules) {
    // laoding GETs
    console.info("Registrating GETs...");
    for (let get of apiModule.get) {
      console.info("> get", get);
      app.get(...get);
    }

    // laoding POSTs
    console.info("Registrating POSTs...");
    for (let post of apiModule.post) {
      console.info("> post", post);
      app.post(...post);
    }

    // laoding PUTs
    console.info("Registrating PUTs...");
    for (let put of apiModule.put) {
      console.info("> put", put);
      app.put(...put);
    }

    // laoding PATCHs
    console.info("Registrating PATCHs...");
    for (let patch of apiModule.patch) {
      console.info("> patch", patch);
      app.patch(...patch);
    }

    // laoding DELETEs
    console.info("Registrating DELETEs...");
    for (let del of apiModule.delete) {
      console.info("> delete", del);
      app.delete(...del);
    }
  }
}

// initializing
app.use(express.json());

init();

app.get("/", function (req, res) {
  const answer = "Lock'n'load, sir! 🤖";
  res.status(200).send(answer);
  console.info(answer);
});

const server = app.listen(process.env.PORT);
server.on("listening", () => {
  console.info(`🪖 Captan! Waiting orders on port ${process.env.PORT} 🫡`);
});
