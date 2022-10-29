import * as dotenv from "dotenv";
dotenv.config();
import * as jose from "jose";

const STANDARD_SALT = process.env.JWT_SALT;

/**
 * Generate a new jwt base on the given data
 */
export async function generateToken({ payload, key, header }) {
  header = header || {};
  header = { alg: "HS256", ...header };
  key = new TextEncoder().encode(key || STANDARD_SALT);

  let jwt = await new jose.SignJWT(payload)
    .setProtectedHeader(header)
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key);

  return jwt;
}
