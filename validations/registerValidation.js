const validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function registerValidation(user) {
  let errors = {};

  user.username = !isEmpty(user.username) ? user.username : "";
  user.email = !isEmpty(user.email) ? user.email : "";
  user.password = !isEmpty(user.password) ? user.password : "";

  //checking for if the user inputted name
  if (validator.isEmpty(user.username)) {
    errors.username = "username required";
  }

  //checking if email input is filled and if it is valid
  if (validator.isEmpty(user.email)) {
    errors.email = "Email required";
  } else if (!validator.isEmail(user.email)) {
    errors.email = "invalid email";
  }

  //check password
  if (validator.isEmpty(user.password)) {
    errors.password = "password required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};