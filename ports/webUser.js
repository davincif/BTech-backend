import { ApiConfigure } from "../objects/in/apiConfigure.js";
import * as UserRegistrationCore from "../core/userRegistrationCore.js";
import { StandardAnswer } from "../objects/out/standardAnswer.js";
import { TObjectUser } from "../objects/transionals/tObjectUser.js";
import * as CoreErros from "../objects/core/coreErros.js";

const UC_ERROR_TRACE = 1;

/**
 * Saves a new user
 * @param {*} req express 'rep' from route
 * @param {*} res express 'res' from route
 */
async function registerUser(req, res) {
  const METHOD_ERROR_TRACE = 1;
  const answer = new StandardAnswer();

  // data check
  if (
    !req.body ||
    Object.keys(req.body).length === 0 ||
    Array.isArray(req.body)
  ) {
    answer.status = `UC${UC_ERROR_TRACE}M${METHOD_ERROR_TRACE}E1`;
    answer.msg = "missing user";
    res.status(400).send(answer);
    return;
  }
  if (!req.body.name) {
    answer.status = `UC${UC_ERROR_TRACE}M${METHOD_ERROR_TRACE}E2`;
    answer.msg = "missing name";
    res.status(400).send(answer);
    return;
  }
  if (!req.body.birth) {
    answer.status = `UC${UC_ERROR_TRACE}M${METHOD_ERROR_TRACE}E2`;
    answer.msg = "missing date of birth";
    res.status(400).send(answer);
    return;
  }

  // transforming the received data into transfer objects
  let user = new TObjectUser();
  user.name = req.body.name;
  user.birth = req.body.birth;

  let registred;
  let httpStatus = 201;

  // actually delegating flow of execution for the user case
  try {
    registred = await UserRegistrationCore.register(user);
  } catch (error) {
    answer.status = `UC${UC_ERROR_TRACE}M${METHOD_ERROR_TRACE}E3`;
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

// constucting exports
const webUserConfigure = new ApiConfigure();
webUserConfigure.post.push(["/register", registerUser]);

export { webUserConfigure };
