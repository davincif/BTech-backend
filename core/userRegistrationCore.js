import { DB_ADAPTOR } from "../adaptors/adaptorDB.js";
import { TObjectError } from "../objects/transionals/tObjectError.js";
import * as CoreErros from "../objects/core/coreErros.js";

/**
 * Register the given user
 * @param {TObjectUser} user The use info to be registered
 * @returns {TObjectUser} The successfully saved object
 */
export async function register(user) {
  if (!user || !user.name || !user.birth || !user.password) {
    const coreErr = new TObjectError();
    coreErr.code = CoreErros.MISSING_DATA;
    coreErr.msg = "MISSING INFORMATION ON USER";
    throw coreErr;
  }

  let savedInfos;
  try {
    savedInfos = await DB_ADAPTOR.saveUser(user);
  } catch (error) {
    const coreErr = new TObjectError();

    switch (error) {
      case 1:
        coreErr.code = CoreErros.MISSING_DATA;
        coreErr.msg = "MISSING INFORMATION ON USER";
        throw coreErr;

      case 2:
        coreErr.code = CoreErros.REGISTER_ALREADY_EXISTS;
        coreErr.msg = "USER ALREADY EXISTS";
        throw coreErr;

      default:
        coreErr.code = CoreErros.UNKOWN;
        coreErr.msg = "DATABASE UNKOWN ERROR";
        throw coreErr;
    }
  }

  // ATTENTION: remember to translate the transfer object to some "core" on if needed

  return savedInfos;
}
