import { ApiConfigure } from "../objects/in/apiConfigure.js";
import * as UserRegistrationCore from "../core/userRegistrationCore.js";
import { StandarAnswer } from "../objects/out/standarAnswer.js";

/**
 * Saves a new user
 * @param {*} req express 'rep' from route
 * @param {*} res express 'res' from route
 */
async function registerUser(req, res) {
  let registred;
  let failure = false;

  try {
    registred = await UserRegistrationCore.register();
  } catch (error) {
    registred = error;
    failure = true;
  }

  const answer = new StandarAnswer();

  if (!failure) {
    answer.status = 201;
    answer.data = registred;
  } else {
    answer.status = 500;
    answer.msg = "UNKNOWN ERROR!"
  }

  res.send(answer);
}

// constucting exports
const userRegistrationConfigure = new ApiConfigure();
userRegistrationConfigure.post.push(["/register", registerUser]);

export { userRegistrationConfigure };
