import { ApiConfigure } from "../objects/in/apiConfigure.js";
import * as jwtAuthentication from "../libraries/apiMiddlewares/jwtAuthentication.js";
import { StandardAnswer } from "../objects/out/standardAnswer.js";
import * as TaskCore from "../core/taskCore.js";
import * as CoreErros from "../objects/core/coreErros.js";

/**
 * Creates a new task for the logged user's in the given project
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
    answer.status = `P3M1E1`;
    answer.msg = "MISSING BODY INFO";
    res.status(400).send(answer);
    return;
  }

  if (!req.body.projName) {
    answer.status = `P3M1E2`;
    answer.msg = "missing project name";
    res.status(400).send(answer);
    return;
  }
  if (!req.body.description) {
    answer.status = `P3M1E3`;
    answer.msg = "missing task description";
    res.status(400).send(answer);
    return;
  }

  let httpStatus = 201;

  // NOT IMPLEMENTED
  httpStatus = 501;
  res.status(httpStatus).send(answer);
}

/**
 * Gets all tasks of a given project from the logged user
 * @param {*} req express 'rep' from route
 * @param {*} res express 'res' from route
 */
async function getAll(req, res) {
  const answer = new StandardAnswer();

  // data consistency check
  if (!req.params.projName) {
    answer.status = `P3M2E2`;
    answer.msg = "missing project name";
    res.status(400).send(answer);
    return;
  }

  // actually delegating flow of execution for the user case
  let tasks;
  let httpStatus = 200;

  let ownerName = req.headers.user.name;
  let projName = req.params.projName;
  try {
    tasks = await TaskCore.getAll({ ownerName, projName });
  } catch (error) {
    switch (error.code) {
      case CoreErros.ENTRY_DOESNT_EXIST:
        httpStatus = 400;
        answer.status = `P3M2E5`;
        answer.msg = error.msg;
        break;

      case CoreErros.PROJECT_DOESNT_EXISTS:
        httpStatus = 404;
        answer.status = `P3M2E6`;
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
    answer.data = tasks || {};
  }

  res.status(httpStatus).send(answer);
}

/**
 * Updates a task for the logged user's in the given project
 * @param {*} req express 'rep' from route
 * @param {*} res express 'res' from route
 */
async function update(req, res) {
  const answer = new StandardAnswer();

  let httpStatus = 200;

  // NOT IMPLEMENTED
  httpStatus = 501;
  res.status(httpStatus).send(answer);
}

async function del(req, res) {
  const answer = new StandardAnswer();

  let httpStatus = 200;

  // NOT IMPLEMENTED
  httpStatus = 501;
  res.status(httpStatus).send(answer);
}

// constucting exports
const webTaskConfigure = new ApiConfigure();
webTaskConfigure.prefix = "/task";
webTaskConfigure.middlewares.push(jwtAuthentication.authRequired);
webTaskConfigure.get.push(["/getAll/:projName", getAll]);
webTaskConfigure.post.push(["/create", create]);
webTaskConfigure.put.push(["/update", update]);
webTaskConfigure.delete.push(["/del", del]);

export { webTaskConfigure };
