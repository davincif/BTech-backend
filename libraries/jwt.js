import * as dotenv from "dotenv";
dotenv.config();
import * as jose from "jose";

const STANDARD_SALT = process.env.JWT_SALT;
const STANDARD_HEADER = { alg: process.env.JWT_ALG };

/**
 * Generate a new jwt base on the given data
 */
export async function generateToken({ payload, key, header }) {
  header = header || {};
  header = { ...STANDARD_HEADER, ...header };
  key = new TextEncoder().encode(key || STANDARD_SALT);

  let jwt = await new jose.SignJWT(payload)
    .setProtectedHeader(header)
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key);

  return jwt;
}

// /**
//  * Get the info inside a jwt
//  * @param {string} jwt
//  */
// export async function getInfos(jwt) {
//   return jose.decodeJwt(jwt);
// }

/**
 * check if the given jwt is valid according to the given configurations
 * @param {*} param0 jwt: string, salt and options to be validated
 * @returns {*} The info inside the jwt or undefined if fails
 */
export async function validate({ jwt, salt, options }) {
  options = options || {};
  options = { ...STANDARD_HEADER, ...options };
  salt = new TextEncoder().encode(salt || STANDARD_SALT);

  let verification;
  try {
    verification = await jose.jwtVerify(jwt, salt, options);
  } catch (error) {}

  return verification;
}
