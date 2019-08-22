const {body} = require('express-validator');
const User = require('../models/user');

exports.registerValidators = [
    body('email')
        .isEmail().withMessage('Enter correct email')
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({email: value});
                if (user) {
                    return Promise.reject('User with this email already exists')
                }
            } catch (e) {
                console.log(e);
            }
        }).normalizeEmail(),
    body('password', 'Password must be at least 6 characters')
        .isLength({min: 6, max: 50})
        .isAlphanumeric()
        .trim(),
    body('password_confirm')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Passwords must match')
            }
            return true;
        })
        .trim(),
    body('name').isLength({min: 3, max: 25}).withMessage('Name must be at least 3 characters').trim()
];


exports.loginValidators = [
    body('email')
        .isEmail().withMessage('Enter correct email'),
    body('password', 'Password must be at least 6 characters')
        .isLength({min: 6, max: 50})
        .isAlphanumeric()
        .trim()
];


exports.courseValidators = [
    body('title')
        .isLength({min: 3})
        .withMessage('Minimum length of the course name is three characters')
        .trim(),
    body('price').isNumeric().withMessage('Enter correct price'),
    body('img', 'Enter correct image URL').isURL()
];