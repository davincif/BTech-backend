import { DB_ADAPTOR } from "../adaptors/adaptorDB.js";

/**
 * Register the given user
 * @param {TObjectUser} user The use info to be registered
 */
export async function register(user) {
  const savedInfos = await DB_ADAPTOR.saveUser(user);

  return savedInfos;
}
