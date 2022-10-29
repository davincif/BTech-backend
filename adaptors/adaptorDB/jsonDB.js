import * as fs from "fs";

import { AuthenUserDB } from "../../objects/out/authenUserDB.js";
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
  dbuser.password = user.password;

  // checking of unicity
  if (await searchByName(dbuser.name)) {
    throw 2;
  }

  // "transaction"
  db.users.push({
    name: dbuser.name,
    birthDate: dbuser.birthDate,
    password: dbuser.password,
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

  let foundUser = db.users.find((user) => user.name === name);

  return foundUser;
}

/**
 * Saves the Authentication key in fast place for quick consulting
 * @param {string} userName the user name to sabe the authkey
 * @param {string} authKey the auth key to be saved
 */
export async function saveAuthentication(userName, authKey) {
  // searching for the user existense
  if (!searchByName(userName)) {
    throw 2;
  }

  // converting object for data base use
  const userAuth = new AuthenUserDB();
  userAuth.authKey = authKey;

  // "transaction"
  db.sections[userName] = { authKey: userAuth.authKey };

  // converting back db object for transaction object
  // code (nothing to do here for now)

  // commit
  saveDb();
}

/**
 * Gets the authentication Obejct if it exists
 * @param {string} userName the user name to sabe the authkey
 * @returns {AuthenUserDB | undefined}
 */
export async function getAuthentication(userName) {
  return db.sections[userName];
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
    users: [],
    sections: {},
  };
}
