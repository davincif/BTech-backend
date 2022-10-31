import { DB_ADAPTOR } from "../adaptors/adaptorDB.js";
import { DB_ERRORS } from "../adaptors/adaptorDB/errorCodes.js";
import * as CoreErros from "../objects/core/coreErros.js";
import { TObjectError } from "../objects/transionals/tObjectError.js";

/**
 * Creates a new Project for the given user
 * @param {TObjectProject} project The project to be created
 */
export async function create(project) {
  if (!project.name || !project.owner) {
    const coreErr = new TObjectError();
    coreErr.code = CoreErros.MISSING_DATA;
    coreErr.msg = "MISSING INFORMATION ON PROJECT";
    throw coreErr;
  }

  project.creationDate = new Date().toISOString();

  let savedInfos;
  try {
    savedInfos = await DB_ADAPTOR.saveProject(project);
  } catch (error) {
    const coreErr = new TObjectError();

    switch (error) {
      case DB_ERRORS.ENTRY_DOESNT_EXIST:
        coreErr.code = CoreErros.MISSING_DATA;
        coreErr.msg = "DOES THIS USER EXIST?";
        throw coreErr;

      case DB_ERRORS.ENTRY_ALREADY_EXISTS:
        coreErr.code = CoreErros.DATABASE_CONFLICT;
        coreErr.msg = "THIS PROJECT ALREADY EXISTS";
        throw coreErr;

      default:
        coreErr.code = CoreErros.UNKOWN;
        coreErr.msg = "DATABASE UNKOWN ERROR";
        throw coreErr;
    }
  }

  return savedInfos;
}

/**
 * Get all projects Project of a user
 * @param {string} ownerName The project to be created
 */
export async function getAll({ ownerName }) {
  if (!ownerName) {
    const coreErr = new TObjectError();
    coreErr.code = CoreErros.MISSING_DATA;
    coreErr.msg = "MISSING INFORMATION OWNER NAME";
    throw coreErr;
  }

  let projects;
  try {
    projects = await DB_ADAPTOR.getAllProject(ownerName);
  } catch (error) {
    const coreErr = new TObjectError();

    switch (error) {
      case DB_ERRORS.ENTRY_DOESNT_EXIST:
        coreErr.code = CoreErros.MISSING_DATA;
        coreErr.msg = "DOES THIS USER EXIST?";
        throw coreErr;

      default:
        coreErr.code = CoreErros.UNKOWN;
        coreErr.msg = "DATABASE UNKOWN ERROR";
        throw coreErr;
    }
  }

  return projects;
}

/**
 * Search the specific project from the specific user
 * @param {*} param0 owner and project's name
 * @returns {* | undefined} the deleted project
 */
export async function getProject({ ownerName, projName }) {
  // code
}

/**
 * Update a particular Project of a user
 */
export async function update() {
  // code
}

/**
 * Deletes a particular Project of a user
 * @param {*} param0 owner and project's name
 * @returns {* | undefined} the deleted project
 */
export async function del({ ownerName, projName }) {
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

  let project;
  try {
    project = await DB_ADAPTOR.deleteProject(ownerName, projName);
  } catch (error) {
    const coreErr = new TObjectError();

    switch (error) {
      case DB_ERRORS.ENTRY_DOESNT_EXIST:
        coreErr.code = CoreErros.MISSING_DATA;
        coreErr.msg = "DOES THIS USER EXIST?";
        throw coreErr;

      case DB_ERRORS.PROJECT_DOESNT_EXIST:
        coreErr.code = CoreErros.MISSING_DATA;
        coreErr.msg = "DOES THIS PROJECT EXIST IN THIS USER?";
        throw coreErr;

      default:
        coreErr.code = CoreErros.UNKOWN;
        coreErr.msg = "DATABASE UNKOWN ERROR";
        throw coreErr;
    }
  }

  return project;
}
