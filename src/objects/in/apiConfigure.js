/**
 * Used by the main.js to autodiscover the methods to be initialized in express
 */
export class ApiConfigure {
  /**
   * Sobre string to be added before the path of all routes of this module
   */
  prefix = "";

  /**
   * Functions to be added as a middleware to these prefix
   */
  middlewares = [];

  /**
   * List of methods to be used as HTTP GET.
   * Eg: get = [['getNote/:id', (req, res) => {}]]
   */
  get = [];
  post = [];
  put = [];
  patch = [];
  delete = [];
}
