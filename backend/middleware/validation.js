const { body, validationResult } = require('express-validator');

// Validation rules for registration
const validateRegistration = [
    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

    body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

    body('name')
    .notEmpty()
    .trim()
    .withMessage('Name is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                errors: errors.array()
            });
        }
        next();
    }
];

// Validation rules for login
const validateLogin = [
    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

    body('password')
    .notEmpty()
    .withMessage('Password is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                errors: errors.array()
            });
        }
        next();
    }
];

module.exports = {
    validateRegistration,
    validateLogin
};