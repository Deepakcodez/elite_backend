import { body, validationResult } from 'express-validator';
import ErrorHandler from '../utils/errorHandler.js';

// Validation middleware
export const validateRequest = (validationRules) => {
  return async (req, res, next) => {
    await Promise.all(validationRules.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorHandler(errors.array()[0].msg, 400)); // Respond with the first validation error
    }
    next();
  };
};

// Validation rules for roles
export const userValidationRules = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export const partnerValidationRules = [
  body('companyName')
    .notEmpty()
    .withMessage('Company name is required'),
  body('contactEmail')
    .isEmail()
    .withMessage('Valid contact email is required'),
];

export const adminValidationRules = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required'),
  body('role')
    .equals('admin')
    .withMessage('Role must be admin'),
];
