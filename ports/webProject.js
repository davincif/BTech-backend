import { ApiConfigure } from "../objects/in/apiConfigure.js";
import { StandardAnswer } from "../objects/out/standardAnswer.js";
import * as CoreErros from "../objects/core/coreErros.js";
import * as ProjectCore from "../core/projectCore.js";
import * as jwtAuthentication from "../libraries/apiMiddlewares/jwtAuthentication.js";
import { TObjectProject } from "../objects/transionals/tObjectProject.js";

/**
 * Creates a new Project for the given user
 * @param {*} req express 'rep' from route
 * @param {*} res express 'res' from route
 */
async function create(req, res) {
  const answer = new StandardAnswer();

  // data consistency check
  if (
    !req.body ||
    Object.keys(req.body).length === 0 ||
    Array.isArray(req.body)
  ) {
    answer.status = `P2M1E1`;
    answer.msg = "missing body info";
    res.status(400).send(answer);
    return;
  }

  if (!req.body.name) {
    answer.status = `P2M1E2`;
    answer.msg = "missing project name";
    res.status(400).send(answer);
    return;
  }

  // transforming the received data into transfer objects
  let project = new TObjectProject();
  project.name = req.body.name;
  project.creationDate = req.body.creationDate;
  project.owner = req.headers.user.name;

  // actually delegating flow of execution for the user case
  let craetedProj;
  let httpStatus = 201;

  try {
    craetedProj = await ProjectCore.create(project);
  } catch (error) {
    switch (error.code) {
      case CoreErros.MISSING_DATA:
        httpStatus = 400;
        answer.status = `P2M1E3`;
        answer.msg = error.msg;
        break;

      case CoreErros.DATABASE_CONFLICT:
        httpStatus = 400;
        answer.status = `P2M1E4`;
        answer.msg = error.msg;
        break;

      case CoreErros.ENTRY_DOESNT_EXIST:
        httpStatus = 400;
        answer.status = `P2M1E5`;
        answer.msg = error.msg;
        break;

      default:
        httpStatus = 500;
        break;
    }
  }

  // success case
  if (httpStatus === 201) {
    answer.status = "0";
    answer.data = craetedProj;
  }

  res.status(httpStatus).send(answer);
}

/**
 * Get all projects Project of a user
 * @param {*} req express 'rep' from route
 * @param {*} res express 'res' from route
 */
async function getAll(req, res) {
  const answer = new StandardAnswer();

  // actually delegating flow of execution for the user case
  let projects;
  let httpStatus = 200;

  let ownerName = req.headers.user.name;
  try {
    projects = await ProjectCore.getAll({ ownerName });
  } catch (error) {
    switch (error.code) {
      case CoreErros.ENTRY_DOESNT_EXIST:
        httpStatus = 400;
        answer.status = `P2M1E5`;
        answer.msg = error.msg;
        break;

      default:
        httpStatus = 500;
        break;
    }
  }

  // success case
  if (httpStatus === 200) {
    answer.status = "0";
    answer.data = projects;
  }

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
    answer.data = projects;
  }

  httpStatus = 501;
  res.status(httpStatus).send(answer);
}

// constucting exports
const webProjectConfigure = new ApiConfigure();
webProjectConfigure.prefix = "/project";
webProjectConfigure.middlewares.push(jwtAuthentication.authRequired);
webProjectConfigure.get.push(["/getAll", getAll]);
webProjectConfigure.post.push(["/create", create]);
webProjectConfigure.put.push(["/update", update]);
webProjectConfigure.delete.push(["/del", del]);

export { webProjectConfigure };
