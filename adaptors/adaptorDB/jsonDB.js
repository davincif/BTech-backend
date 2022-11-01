import * as fs from "fs";

import { AuthenUserDB } from "../../objects/out/authenUserDB.js";
import { UserDB } from "../../objects/out/userDB.js";
import { ProjectDB } from "../../objects/out/projectDB.js";
import { TasksDB } from "../../objects/out/tasksDB.js";
import { DB_ERRORS } from "./errorCodes.js";

const dbPath = "./db.json";
const encoding = "utf8";
const dbFile = fs.openSync(dbPath, "r+");
let db;
loadDb();

/**
 * Save a user register
 * @param {TObjectUser} user The use info to be registered
 * @returns {UserDB} the saved informations
 */
export async function saveUser(user) {
  if (!user || !user.name || !user.birth) {
    throw DB_ERRORS.INVALID_ARGS;
  }

  // converting object for data base use
  const dbuser = new UserDB();
  dbuser.name = user.name;
  dbuser.birthDate = user.birth;
  dbuser.password = user.password;

  // checking of unicity
  if (await searchByName(dbuser.name)) {
    throw DB_ERRORS.ENTRY_DOESNT_EXIST;
  }

  // "transaction"
  db.users[dbuser.name] = {
    name: dbuser.name,
    birthDate: dbuser.birthDate,
    password: dbuser.password,
  };

  // converting back db object for transaction object
  // code (nothing to do here for now)

  // commit changes to db
  saveDb();

  // returning as
  return user;
}

/**
 * Searches an user by it's name
 * @param {string} name user to be searched
 * @returns {UserDB | undefined} the found user
 */
export async function searchByName(name) {
  if (!name) {
    throw DB_ERRORS.INVALID_ARGS;
  }

  let foundUser = db.users[name];

  return foundUser;
}

/**
 * Saves the Authentication key in fast place for quick consulting
 * @param {string} userName the user name to sabe the authkey
 * @param {string} authKey the auth key to be saved
 */
export async function saveAuthentication(userName, authKey) {
  // searching for the user existense
  if (!searchByName(userName)) {
    throw DB_ERRORS.ENTRY_DOESNT_EXIST;
  }

  // converting object for data base use
  const userAuth = new AuthenUserDB();
  userAuth.authKey = authKey;

  // "transaction"
  db.sections[userName] = { authKey: userAuth.authKey };

  // converting back db object for transaction object
  // code (nothing to do here for now)

  // commit
  saveDb();
}

/**
 * Gets the authentication Obejct if it exists
 * @param {string} userName the user name to be searched
 * @returns {AuthenUserDB | undefined}
 */
export async function getAuthentication(userName) {
  return db.sections[userName];
}

/**
 * Delete de given authentication form the database
 * @param {string} userName the user name to be deleted
 * @returns {boolean} weather if the was something to be deleted or not
 */
export async function deleteAuthentication(userName) {
  let section = db.sections[userName];
  if (!section) {
    return false;
  }

  delete db.sections[userName];
  saveDb();

  return true;
}

/**
 * Save the given project if the given user exists and the given project wasn't
 * already crated
 * @param {TObjectProject} project project info
 */
export async function saveProject(project) {
  // searching for the user existense
  let user = await searchByName(project.owner);
  if (!user) {
    throw DB_ERRORS.ENTRY_DOESNT_EXIST;
  }

  user = db.users[user.name];

  // create projects for this user if needed
  if (!user.projects) {
    user.projects = {};
  }

  // check if this project already exists
  if (user.projects[project.name]) {
    throw DB_ERRORS.ENTRY_ALREADY_EXISTS;
  }

  // converting object for data base use
  const dbproject = new ProjectDB();
  dbproject.name = project.name;
  dbproject.creationDate = project.creationDate;

  // "transaction"
  user.projects[dbproject.name] = {
    name: dbproject.name,
    creationDate: dbproject.creationDate,
  };

  // commit
  saveDb();

  return project;
}

/**
 * Search and retrieves the projects of a specific user
 * @param {string} ownerName name of the owner of the projects to be searched
 * @returns {* | undefined} all projects from the given user
 */
export async function getAllProject(ownerName) {
  // searching for the user existense
  let user = await searchByName(ownerName);
  if (!user) {
    throw DB_ERRORS.ENTRY_DOESNT_EXIST;
  }

  let projects = db.users[user.name].projects;

  return projects;
}

/**
 * Search the specific project from the specific user
 * @param {string} ownerName user's name
 * @param {string} projName project's name
 * @returns {* | undefined} the specific project requested or undefined
 */
export async function getProject(ownerName, projName) {
  // searching for the user existense
  let user = await searchByName(ownerName);
  if (!user) {
    throw DB_ERRORS.ENTRY_DOESNT_EXIST;
  }

  let project = db.users[user.name].projects[projName];
  if (!project) {
    throw DB_ERRORS.PROJECT_DOESNT_EXIST;
  }

  return project;
}

/**
 * Delete the specific project from the specific user
 * @param {string} ownerName user's name
 * @param {string} projName project's name
 * @returns {* | undefined} the specific project delete or undefined
 */
export async function deleteProject(ownerName, projName) {
  // searching for the user existense
  let user = await searchByName(ownerName);
  if (!user) {
    throw DB_ERRORS.ENTRY_DOESNT_EXIST;
  }

  let project = db.users[user.name].projects[projName];
  if (!project) {
    throw DB_ERRORS.PROJECT_DOESNT_EXIST;
  }

  // "transaction"
  delete db.users[user.name].projects[projName];

  // commit
  saveDb();

  return project;
}

/**
 * Updates the given project with the given new informations about it
 * @param {TObjectUpdateProject} updatedProject project with updated info
 */
export async function updateProject(updatedProject) {
  // searching for the user existense
  const oldProject = await getProject(
    updatedProject.ownerName,
    updatedProject.oldName
  );

  // "transaction"
  oldProject.name = updatedProject.newName;

  // commit
  saveDb();

  return oldProject;
}

/**
 * Saves the given task to the database
 * @param {TObjectTask} task task to be saved on the DB
 */
export async function saveTask(task) {
  const project = await getProject(task.ownerName, task.projName);
  if (!project) {
    throw DB_ERRORS.PROJECT_DOESNT_EXIST;
  }

  // create tasks for this user's project if needed
  if (!project.tasks) {
    project.tasks = {};
  }

  // converting object for data base use
  const dbTask = new TasksDB();
  dbTask.id = Object.keys(project.tasks).length;
  dbTask.description = task.description;
  dbTask.creationDate = task.creationDate;
  dbTask.terminationDate = task.terminationDate;

  // "transaction"
  project.tasks[dbTask.id] = {
    id: dbTask.id,
    description: dbTask.description,
    creationDate: dbTask.creationDate,
    terminationDate: dbTask.terminationDate,
  };

  // commit
  saveDb();

  return dbTask;
}

/**
 * Gets the given task from the database
 * @param {string} ownerName user's name
 * @param {string} projName project's name
 * @returns {TasksDB | undefined}
 */
export async function getAllTasks(ownerName, projName) {
  const project = await getProject(ownerName, projName);
  if (!project) {
    return;
  }

  return project.tasks;
}

/**
 * Deletes the given task from the database
 * @param {TObjectTask} task task to be saved on the DB
 */
export async function deleteTask(task) {
  const project = await getProject(task.ownerName, task.projName);
  if (!project) {
    throw DB_ERRORS.PROJECT_DOESNT_EXIST;
  }

  // check if this task already exists
  let taskToResturn = project.tasks[task.taskID];
  if (!taskToResturn) {
    throw DB_ERRORS.TASK_DOESNT_EXIST;
  }

  // "transaction"
  delete project.tasks[task.taskID];

  // commit
  saveDb();

  return taskToResturn;
}

/* LOCAL FUNCTIONS */

/**
 * Save the data base presente in the variable 'db'
 */
function saveDb() {
  fs.writeFileSync(dbPath, JSON.stringify(db));
}

/**
 * loads the data base presente in the variable 'db'
 */
function loadDb() {
  let readFile = fs.readFileSync(dbFile, { encoding, flag: "r" });
  if (readFile) {
    db = JSON.parse(readFile);
  } else {
    initDb();
    saveDb();
  }
}

/**
 * Initialize the database, creating the "tables"
 */
function initDb() {
  db = {
    users: {},
    sections: {},
  };
}
