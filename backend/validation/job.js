const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateJobInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.title = !isEmpty(data.title) ? data.title : "";
  data.applications = !isEmpty(data.applications) ? data.applications : 0;
  data.positions = !isEmpty(data.positions) ? data.positions : 0;
  
  if (Validator.isEmpty(data.title)) {
    errors.title = "Title field is required";
  }
  if (data.applications === 0){
      errors.applications = "Number of applications cant be 0";
  }
  if (data.positions === 0){
      errors.positions = "Number of positions cant be 0";
  }
  if (data.positions < data.applications){
      errors.positions = "Number of positions cant be less than number of applications";
  }
  if (data.deadline > Date.now){
      errors.deadline = "Deadline already passed";
  }
  if (data.typeOfJob === ''){
      errors.typeOfJob = "Please select a Job Type";
  }
  if (data.salary < 0){
      errors.salary = "Salary of job cannot be negative";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};