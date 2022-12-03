const validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function loginValidation(user) {
  let errors = {};

  user.username = !isEmpty(user.username) ? user.username : "";
  user.password = !isEmpty(user.password) ? user.password : "";

  //checking for if the user inputted name
  if (validator.isEmpty(user.username)) {
    errors.username = "username required";
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