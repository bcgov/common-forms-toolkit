const log = require('npmlog');
const Problem = require('api-problem');
const { validators } = require('../components/validators');

const handleValidationErrors = (res, next, errors) => {
  if (errors && errors.length) {
    log.error('handleValidationErrors', JSON.stringify(errors));
    return new Problem(422, {
      detail: 'Validation failed',
      errors: errors
    }).send(res);
  }

  next();
};

const validation = {
  validateEmail: (req, res, next) => {
    const errors = validators.email(req.body);
    handleValidationErrors(res, next, errors);
  },

  validateIPC: (req, res, next) => {
    const errors = validators.ipc(req.body);
    handleValidationErrors(res, next, errors);
  }
};

module.exports = validation;
