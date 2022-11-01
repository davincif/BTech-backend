import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import { webUserConfigure } from "./ports/webUser.js";
import { webProjectConfigure } from "./ports/webProject.js";
import { webTaskConfigure } from "./ports/webTask.js";

const apiModules = [webUserConfigure, webProjectConfigure, webTaskConfigure];
const app = express();

function init() {
  // loading modules
  console.info("loading modules...");
  for (let apiModule of apiModules) {
    // laoding middlewares
    for (let middleware of apiModule.middlewares) {
      console.info(`adding middlewares on "${apiModule.prefix}"...`);
      app.use(apiModule.prefix, middleware);
    }

    // laoding GETs
    for (let get of apiModule.get) {
      get[0] = `${apiModule.prefix}${get[0]}`;
      console.info("get", get);
      app.get(...get);
    }

    // laoding POSTs
    for (let post of apiModule.post) {
      post[0] = `${apiModule.prefix}${post[0]}`;
      console.info("post", post);
      app.post(...post);
    }

    // laoding PUTs
    for (let put of apiModule.put) {
      put[0] = `${apiModule.prefix}${put[0]}`;
      console.info("put", put);
      app.put(...put);
    }

    // laoding PATCHs
    for (let patch of apiModule.patch) {
      patch[0] = `${apiModule.prefix}${patch[0]}`;
      console.info("patch", patch);
      app.patch(...patch);
    }

    // laoding DELETEs
    for (let del of apiModule.delete) {
      del[0] = `${apiModule.prefix}${del[0]}`;
      console.info("delete", del);
      app.delete(...del);
    }
  }
}

// initializing
app.use(express.json());
const corsOptions = {
  origin: process.env.CORS_ORIGINS,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
console.log("corsOptions", corsOptions);
app.use(cors(corsOptions));

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
