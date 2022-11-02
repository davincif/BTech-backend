// ATTENTION: THIS IMPORT IS ARCHITECTURALLY WRONG!!! A Dependency inversion is needee
import { islogedAndAuthenticated } from "../../core/userAuthCore.js";
import { validate } from "../jwt.js";

/**
 * Guaratees that this request has an authenticated users
 * @param {*} req express 'rep' from route
 * @param {*} res express 'res' from route
 * @param {*} next express 'res' next route
 */
export async function authRequired(req, res, next) {
  const jwt = req.headers["authorization"]?.split(" ")[1] || "";
  if (!jwt) {
    // authentication not present in header
    res.status(401).send();
    return;
  }

  let jwtinfo = await validate({ jwt });
  if (!jwtinfo) {
    // jwt is not valid
    res.status(401).send();
    return;
  }

  let userName = jwtinfo.payload.name;
  let isAuth = await islogedAndAuthenticated({
    jwt,
    name: userName,
  });
  if (!isAuth) {
    // is not loged or the authentication does not match
    res.status(401).send();
    return;
  }

  req.headers["user"] = {
    name: userName,
  };
  next();
}
