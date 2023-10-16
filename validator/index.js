const { body } = require('express-validator');

exports.validateName = body('name').notEmpty().withMessage('Name is required');
exports.validateEmail = body('email')
  .isEmail().withMessage('Email must be between 3 to 32 characters')
  .matches(/@/)
  .withMessage('Email must contain @')
  .isLength({
    min: 3, max: 32
  });
exports.validatePassword = body('password')
  .notEmpty().withMessage('Password is required')
  .isLength({ min: 4 }).withMessage('Password must contain at least 4 characters');
