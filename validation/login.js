const Validator = require("validator");
const isEmpty = require("./is_empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required..";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid..";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required..";
  } else if (!Validator.isLength(data.password, { min: 3, max: 30 })) {
    errors.password = "Password must be of atleast 3 characters and atmost 30!";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
