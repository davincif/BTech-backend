import { ApiConfigure } from "../objects/in/apiConfigure.js";
import { StandardAnswer } from "../objects/out/standardAnswer.js";
import { DB_ADAPTOR } from "../adaptors/adaptorDB.js";
import * as CoreErros from "../objects/core/coreErros.js";
import * as jwtAuthentication from "../libraries/apiMiddlewares/jwtAuthentication.js";

/**
 * Creates a new Project for the given user
 * @param {*} req express 'rep' from route
 * @param {*} res express 'res' from route
 */
async function create(req, res) {
  const answer = new StandardAnswer();
  let httpStatus = 201;

  // success case
  if (httpStatus === 201) {
    answer.status = "0";
  }

  httpStatus = 501;
  res.status(httpStatus).send(answer);
}

/**
 * Get all projects Project of a user
 * @param {*} req express 'rep' from route
 * @param {*} res express 'res' from route
 */
async function getAll(req, res) {
  const answer = new StandardAnswer();
  let httpStatus = 200;

  // success case
  if (httpStatus === 200) {
    answer.status = "0";
  }

  httpStatus = 501;
  res.status(httpStatus).send(answer);
}

/**
 * Update a particular Project of a user
 * @param {*} req express 'rep' from route
 * @param {*} res express 'res' from route
 */
async function update(req, res) {
  const answer = new StandardAnswer();
  let httpStatus = 200;

  // success case
  if (httpStatus === 200) {
    answer.status = "0";
  }

  httpStatus = 501;
  res.status(httpStatus).send(answer);
}

/**
 * Deletes a particular Project of a user
 * @param {*} req express 'rep' from route
 * @param {*} res express 'res' from route
 */
async function del(req, res) {
  const answer = new StandardAnswer();
  let httpStatus = 200;

  // success case
  if (httpStatus === 200) {
    answer.status = "0";
  }

  httpStatus = 501;
  res.status(httpStatus).send(answer);
}

// constucting exports
const webProjectConfigure = new ApiConfigure();
webProjectConfigure.prefix = "/project";
webProjectConfigure.middlewares.push(jwtAuthentication.authRequired);
webProjectConfigure.get.push(["/getAll", create]);
webProjectConfigure.post.push(["/create", getAll]);
webProjectConfigure.put.push(["/update", update]);
webProjectConfigure.delete.push(["/del", del]);

export { webProjectConfigure };
