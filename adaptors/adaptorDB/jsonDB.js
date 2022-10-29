import * as fs from "fs";

import { UserDB } from "../../objects/out/userDB.js";

const dbPath = "./db.json";
const encoding = "utf8";
const dbFile = fs.openSync(dbPath, "r+");
let db;
loadDb();

/**
 * Save a user register
 * @param {TObjectUser} user The use info to be registered
 * @returns {UserDB} the saved informations
 */
export async function saveUser(user) {
  if (!user || !user.name || !user.birth) {
    throw 1;
  }

  // converting object for data base use
  const dbuser = new UserDB();
  dbuser.name = user.name;
  dbuser.birthDate = user.birth;

  // checking of unicity
  if(await searchByName(dbuser.name)) {
    throw 2;
  }

  // "transaction"
  db.user.push({
    name: dbuser.name,
    birthDate: dbuser.birthDate,
  });

  // converting back db object for transaction object
  // code (nothing to do here for now)

  // commit changes to db
  saveDb();

  // returning as
  return user;
}

/**
 * Searches an user by it's name
 * @param {string} name user to be searched
 * @returns {UserDB | undefined} the found user
 */
export async function searchByName(name) {
  if (!name) {
    throw 1;
  }

  let foundUser = db.user.find((user) => user.name === name);

  return foundUser;
}

/* local fucntion */

/**
 * Save the data base presente in the variable 'db'
 */
function saveDb() {
  fs.writeFileSync(dbPath, JSON.stringify(db));
}

/**
 * loads the data base presente in the variable 'db'
 */
function loadDb() {
  let readFile = fs.readFileSync(dbFile, { encoding, flag: "r" });
  if (readFile) {
    db = JSON.parse(readFile);
  } else {
    initDb();
    saveDb();
  }
}

/**
 * Initialize the database, creating the "tables"
 */
function initDb() {
  db = {
    user: [],
  };
}
