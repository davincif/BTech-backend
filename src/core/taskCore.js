import { DB_ADAPTOR } from "../adaptors/adaptorDB.js";
import { DB_ERRORS } from "../adaptors/adaptorDB/errorCodes.js";
import * as CoreErros from "../objects/core/coreErros.js";
import { TObjectError } from "../objects/transionals/tObjectError.js";
import { TObjectTask } from "../objects/transionals/tObjectTask.js";

/**
 * Get all tasks in the Project of a user
 * @param {TObjectTask} task The task of the user's project to be created
 */
export async function create(task) {
  if (!task?.ownerName) {
    const coreErr = new TObjectError();
    coreErr.code = CoreErros.MISSING_DATA;
    coreErr.msg = "MISSING INFORMATION: USER NAME";
    throw coreErr;
  }
  if (!task.projName) {
    const coreErr = new TObjectError();
    coreErr.code = CoreErros.MISSING_DATA;
    coreErr.msg = "MISSING INFORMATION: PROJECT NAME";
    throw coreErr;
  }
  if (!task.description) {
    const coreErr = new TObjectError();
    coreErr.code = CoreErros.MISSING_DATA;
    coreErr.msg = "MISSING INFORMATION DESCRIPTION";
    throw coreErr;
  }

  let createdTasks;
  task.creationDate = new Date().toISOString();
  try {
    createdTasks = await DB_ADAPTOR.saveTask(task);
  } catch (error) {
    const coreErr = new TObjectError();

    switch (error) {
      case DB_ERRORS.ENTRY_DOESNT_EXIST:
        coreErr.code = CoreErros.MISSING_DATA;
        coreErr.msg = "DOES THIS USER EXISTS?";
        throw coreErr;

      case DB_ERRORS.PROJECT_DOESNT_EXIST:
        coreErr.code = CoreErros.PROJECT_DOESNT_EXISTS;
        coreErr.msg = "DOES THIS PROJECT EXISTS?";
        throw coreErr;

      default:
        coreErr.code = CoreErros.UNKOWN;
        coreErr.msg = "DATABASE UNKOWN ERROR";
        throw coreErr;
    }
  }

  return createdTasks;
}

/**
 * Get all projects Project of a user
 * @param {string} ownerName The user's project to be searched
 * @param {string} projName The project to be searched
 */
export async function getAll({ ownerName, projName }) {
  if (!ownerName) {
    const coreErr = new TObjectError();
    coreErr.code = CoreErros.MISSING_DATA;
    coreErr.msg = "MISSING INFORMATION OWNER NAME";
    throw coreErr;
  }
  if (!projName) {
    const coreErr = new TObjectError();
    coreErr.code = CoreErros.MISSING_DATA;
    coreErr.msg = "MISSING INFORMATION PROJECT NAME";
    throw coreErr;
  }

  let tasks;
  try {
    tasks = await DB_ADAPTOR.getAllTasks(ownerName, projName);
  } catch (error) {
    const coreErr = new TObjectError();

    switch (error) {
      case DB_ERRORS.ENTRY_DOESNT_EXIST:
        coreErr.code = CoreErros.MISSING_DATA;
        coreErr.msg = "DOES THIS USER EXISTS?";
        throw coreErr;

      case DB_ERRORS.PROJECT_DOESNT_EXIST:
        coreErr.code = CoreErros.PROJECT_DOESNT_EXISTS;
        coreErr.msg = "DOES THIS PROJECT EXISTS?";
        throw coreErr;

      default:
        coreErr.code = CoreErros.UNKOWN;
        coreErr.msg = "DATABASE UNKOWN ERROR";
        throw coreErr;
    }
  }

  return tasks;
}

/**
 * Delete requested task
 * @param {string} ownerName The user's project to be modified
 * @param {string} projName The project to be modified
 * @param {string} projName The task id to be modified
 * @returns The delete task
 */
export async function del({ ownerName, projName, taskID }) {
  if (!ownerName) {
    const coreErr = new TObjectError();
    coreErr.code = CoreErros.MISSING_DATA;
    coreErr.msg = "MISSING INFORMATION OWNER NAME";
    throw coreErr;
  }
  if (!projName) {
    const coreErr = new TObjectError();
    coreErr.code = CoreErros.MISSING_DATA;
    coreErr.msg = "MISSING INFORMATION PROJECT NAME";
    throw coreErr;
  }
  if (!taskID) {
    const coreErr = new TObjectError();
    coreErr.code = CoreErros.MISSING_DATA;
    coreErr.msg = "MISSING INFORMATION: TASK ID";
    throw coreErr;
  }

  let taskToDelete = new TObjectTask();
  taskToDelete.ownerName = ownerName;
  taskToDelete.projName = projName;
  taskToDelete.taskID = taskID;

  let delTask;
  try {
    delTask = await DB_ADAPTOR.deleteTask(taskToDelete);
  } catch (error) {
    const coreErr = new TObjectError();

    switch (error) {
      case DB_ERRORS.ENTRY_DOESNT_EXIST:
        coreErr.code = CoreErros.MISSING_DATA;
        coreErr.msg = "DOES THIS USER EXISTS?";
        throw coreErr;

      case DB_ERRORS.PROJECT_DOESNT_EXIST:
        coreErr.code = CoreErros.MISSING_DATA;
        coreErr.msg = "DOES THIS PROJECT EXISTS?";
        throw coreErr;

      case DB_ERRORS.TASK_DOESNT_EXIST:
        coreErr.code = CoreErros.MISSING_DATA;
        coreErr.msg = "DOES THIS TASK EXISTS?";
        throw coreErr;

      default:
        coreErr.code = CoreErros.UNKOWN;
        coreErr.msg = "DATABASE UNKOWN ERROR";
        throw coreErr;
    }
  }

  return delTask;
}

/**
 * Delete requested task
 * @param {TObjectTask} task The user's project to be modified with the
 * modification wanted
 * @returns {TasksDB} the updated task
 */
export async function finish(task) {
  if (!task?.ownerName) {
    const coreErr = new TObjectError();
    coreErr.code = CoreErros.MISSING_DATA;
    coreErr.msg = "MISSING INFORMATION: USER NAME";
    throw coreErr;
  }
  if (!task.taskID) {
    const coreErr = new TObjectError();
    coreErr.code = CoreErros.MISSING_DATA;
    coreErr.msg = "MISSING INFORMATION: USER NAME";
    throw coreErr;
  }
  if (!task.projName) {
    const coreErr = new TObjectError();
    coreErr.code = CoreErros.MISSING_DATA;
    coreErr.msg = "MISSING INFORMATION: PROJECT NAME";
    throw coreErr;
  }

  let taskToUpdate = new TObjectTask();
  taskToUpdate.ownerName = task.ownerName;
  taskToUpdate.projName = task.projName;
  taskToUpdate.taskID = task.taskID;
  // PS: creation date is never modified
  taskToUpdate.terminationDate = new Date().toISOString();

  // check if the requested task isn't already finished
  let currentTask;
  try {
    currentTask = await DB_ADAPTOR.getTask(taskToUpdate);
  } catch (error) {
    switch (error) {
      case DB_ERRORS.ENTRY_DOESNT_EXIST:
        coreErr.code = CoreErros.MISSING_DATA;
        coreErr.msg = "DOES THIS USER EXISTS?";
        throw coreErr;

      case DB_ERRORS.PROJECT_DOESNT_EXIST:
        coreErr.code = CoreErros.MISSING_DATA;
        coreErr.msg = "DOES THIS PROJECT EXISTS?";
        throw coreErr;

      case DB_ERRORS.TASK_DOESNT_EXIST:
        coreErr.code = CoreErros.MISSING_DATA;
        coreErr.msg = "DOES THIS TASK EXISTS?";
        throw coreErr;

      default:
        coreErr.code = CoreErros.UNKOWN;
        coreErr.msg = "DATABASE UNKOWN ERROR";
        throw coreErr;
    }
  } finally {
    // garanting that the requested task hasn't already been finished
    if (currentTask.terminationDate) {
      const coreErr = new TObjectError();
      coreErr.code = CoreErros.MODIFYING_IMMUTABLE;
      coreErr.msg = "YOU CANNOT FINISH AN ALREADY FINISHED TASK";
      throw coreErr;
    }
  }

  let updatedTask;
  try {
    updatedTask = await DB_ADAPTOR.updateTask(taskToUpdate);
  } catch (error) {
    switch (error) {
      case DB_ERRORS.ENTRY_DOESNT_EXIST:
        coreErr.code = CoreErros.MISSING_DATA;
        coreErr.msg = "DOES THIS USER EXISTS?";
        throw coreErr;

      case DB_ERRORS.PROJECT_DOESNT_EXIST:
        coreErr.code = CoreErros.MISSING_DATA;
        coreErr.msg = "DOES THIS PROJECT EXISTS?";
        throw coreErr;

      case DB_ERRORS.TASK_DOESNT_EXIST:
        coreErr.code = CoreErros.MISSING_DATA;
        coreErr.msg = "DOES THIS TASK EXISTS?";
        throw coreErr;

      default:
        coreErr.code = CoreErros.UNKOWN;
        coreErr.msg = "DATABASE UNKOWN ERROR";
        throw coreErr;
    }
  }

  return updatedTask;
}
