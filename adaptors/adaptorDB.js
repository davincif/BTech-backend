import * as dotenv from "dotenv";
dotenv.config();

let DB_ADAPTOR;

async function init() {
  const choosenDB = (process.env.USE_DATABASE || "").toLowerCase();

  switch (choosenDB) {
    case "json":
      DB_ADAPTOR = await import("./adaptorDB/jsonDB.js");
      break;

    default:
      console.error("Hey, haven't you forgotten to set 'USE_DATABASE' on your environment?");
      throw  Error("NO DATABASE IS SET");
      break;
  }
}
init();

export { DB_ADAPTOR };
