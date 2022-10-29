import { DB_ADAPTOR } from "../adaptors/adaptorDB.js";
import { TObjectError } from "../objects/transionals/tObjectError.js";
import * as CoreErros from "../objects/core/coreErros.js";
import * as JWT from "../libraries/jwt.js";

/**
 * Logs the user and returns his authentication
 * @param {*} param0 user name and password
 * @returns {Promise<string>} the user on success jwt
 */
export async function login({ name, password }) {
  let authentication = "";

  // confirm is the user had sent the correct password
  let isPasswordConfirmed = await confirmPassword({ name, password });
  if (!isPasswordConfirmed) {
    // user cannot be authenticated
    const coreErr = new TObjectError();
    coreErr.code = coreErr.INCORRECT_PASSWORD;
    coreErr.msg = "PASSWORD DOES NOT MATCH";

    throw coreErr;
  }

  // authenticate user
  authentication = await JWT.generateToken({ payload: { name } });

  // save user's jwt in a safe and fast place
  DB_ADAPTOR.saveAuthentication(name, authentication).catch((err) => {
    console.warn('Untreated error!!', err);
  })

  return authentication;
}

/**
 * Confirm if the given user really has the given password
 * @param {*} param0 user name and password
 * @returns {Promise<boolean>} if the passwords matchs or not
 */
export async function confirmPassword({ name, password }) {
  let matchs;

  let savedInfos;
  try {
    savedInfos = await DB_ADAPTOR.searchByName(name);
  } catch (error) {
    matchs = false;
  }

  if (matchs === false || !savedInfos) {
    return false;
  }

  return savedInfos.password === password;
}
