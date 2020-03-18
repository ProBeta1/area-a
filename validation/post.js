const Validator = require("validator");
const isEmpty = require("./is_empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (!Validator.isLength(data.text, { min: 1, max: 321 })) {
    errors.text = "The Post must be between 1 to 321 characters!";
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required..";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
