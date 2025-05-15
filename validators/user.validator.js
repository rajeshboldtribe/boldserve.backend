const { body, validationResult } = require("express-validator");
const HttpStatus = require("../enums/httpStatusCode.enum");
const ResponseMessages = require("../enums/responseMessage.enum");

const userValidator = {};

userValidator.validateUserForLogin = [
  body("user_name").notEmpty().withMessage("User name is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

userValidator.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.error(
      HttpStatus.UNPROCESSABLE_ENTITY,
      "false",
      ResponseMessages.VALIDATION_ERROR,
      errors.array()
    );
  }
  next();
};

module.exports = userValidator;
