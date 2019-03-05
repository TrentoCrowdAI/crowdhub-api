const Boom = require('boom');

/**
 * Returns a business error. The name property
 * of the error object is set to "business".
 *
 * @param {String} msg
 * @returns {Error}
 */
const createBusinessError = msg => {
  let e = new Error(msg);
  e.name = 'business';
  return e;
};

/**
 * Creates an error that the service layer returns. It uses the boom library.
 *
 * @param {Error} e An error object. The property name should be set
 * to correctly perform the mapping from error to HTTP status code.
 */
const createServiceError = e => {
  if (e.name == 'business') {
    return Boom.badRequest(e.message);
  }
  return Boom.badImplementation();
};

module.exports = {
  createBusinessError,
  createServiceError
};
