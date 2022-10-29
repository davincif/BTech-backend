import { ApiConfigure } from "../objects/in/apiConfigure.js";
import * as UserRegistrationCore from "../core/userRegistrationCore.js";
import * as UserAuthCore from "../core/userAuthCore.js";
import { StandardAnswer } from "../objects/out/standardAnswer.js";
import { TObjectUser } from "../objects/transionals/tObjectUser.js";
import * as CoreErros from "../objects/core/coreErros.js";

/**
 * Saves a new user
 * @param {*} req express 'rep' from route
 * @param {*} res express 'res' from route
 */
async function register(req, res) {
  const answer = new StandardAnswer();

  // data consistency check
  if (
    !req.body ||
    Object.keys(req.body).length === 0 ||
    Array.isArray(req.body)
  ) {
    answer.status = `UC1M1E1`;
    answer.msg = "missing body info";
    res.status(400).send(answer);
    return;
  }
  if (!req.body.name) {
    answer.status = `UC1M1E2`;
    answer.msg = "missing name";
    res.status(400).send(answer);
    return;
  }
  if (!req.body.birth) {
    answer.status = `UC1M1E2`;
    answer.msg = "missing date of birth";
    res.status(400).send(answer);
    return;
  }
  if (!req.body.password) {
    answer.status = `UC1M1E2`;
    answer.msg = "missing password";
    res.status(400).send(answer);
    return;
  }

  // transforming the received data into transfer objects
  let user = new TObjectUser();
  user.name = req.body.name;
  user.birth = req.body.birth;
  user.password = req.body.password;

  // actually delegating flow of execution for the user case
  let registred;
  let httpStatus = 201;

  try {
    registred = await UserRegistrationCore.register(user);
  } catch (error) {
    answer.status = `UC1M1E3`;
    answer.msg = error.msg;
    switch (error.code) {
      case CoreErros.MISSING_DATA:
        httpStatus = 400;
        break;

      case CoreErros.REGISTER_ALREADY_EXISTS:
        httpStatus = 409;
        break;

      case CoreErros.UNKOWN:
      default:
        httpStatus = 500;
        break;
    }
  }

  // success case
  if (httpStatus === 201) {
    answer.status = "0";
    answer.data = registred;
  }

  res.status(httpStatus).send(answer);
}

/**
 * Logs the user in the system and return it's authentication
 * @param {*} req express 'rep' from route
 * @param {*} res express 'res' from route
 */
async function login(req, res) {
  const answer = new StandardAnswer();

  // data consistency check
  if (
    !req.body ||
    Object.keys(req.body).length === 0 ||
    Array.isArray(req.body)
  ) {
    answer.status = `UC1M2E1`;
    answer.msg = "missing body info";
    res.status(400).send(answer);
    return;
  }

  if (!req.body.name) {
    answer.status = `UC1M2E2`;
    answer.msg = "missing name";
    res.status(400).send(answer);
    return;
  }
  if (!req.body.password) {
    answer.status = `UC1M2E3`;
    answer.msg = "missing password";
    res.status(400).send(answer);
    return;
  }

  // transforming the received data into transfer objects
  let user = new TObjectUser();
  user.name = req.body.name;
  user.password = req.body.password;

  // actually delegating flow of execution for the user case
  let auth;
  let httpStatus = 200;

  try {
    auth = await UserAuthCore.login({
      name: user.name,
      password: user.password,
    });
  } catch (error) {
    answer.status = `UC1M2E4`;

    switch (error.code) {
      default:
        httpStatus = 500;
        break;
    }
  }

  // success case
  if (httpStatus === 200) {
    answer.status = "0";
    answer.data = auth;
  }

  res.status(httpStatus).send(answer);
}

// constucting exports
const webUserConfigure = new ApiConfigure();
webUserConfigure.post.push(["/register", register]);
webUserConfigure.post.push(["/login", login]);

export { webUserConfigure };
