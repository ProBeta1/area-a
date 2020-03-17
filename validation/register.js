const Validator = require("validator");
const isEmpty = require("./is_empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be b/w 2 to 30 characters please!";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
