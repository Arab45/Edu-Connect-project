const {check, validationResult} = require('express-validator');
const {sendError} = require('./index');

const validateSignup = [
    check('fullName')
    .trim()
    .not()
    .isEmpty()
    .withMessage('full name is missing'),
    check('email').trim()
    .not()
    .isEmpty()
    .withMessage('email is missing')
    .isEmail()
    .withMessage('email is not valid')
    .isLowercase(),
    check('username')
    .trim()
    .not()
    .isEmpty()
    .withMessage('username is missing'),
    check('phone')
    .trim()
    .not()
    .isEmpty()
    .withMessage('phone number is missing'),
    check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('password is missing')
    .isLength({min: 8})
    .withMessage('password must at least 8 character long')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage('Password must contain both letters and numbers'),
    check('class')
    .trim()
    .not()
    .isEmpty()
    .withMessage('class is missing'),
    check('subject')
    .trim()
    .not()
    .isEmpty()
    .withMessage('subject is missing'),
    check('school')
    .trim()
    .not()
    .isEmpty()
    .withMessage('school is missing')
];

const validateQuestion = [
    check('title')
    .trim()
    .not()
    .isEmpty()
    .withMessage('title is missing'),
    check('body')
    .trim()
    .not()
    .isEmpty()
    .withMessage('body is missing')
    .isLength({min: 10})
    .withMessage('body must at least 10 words long')
];

const validateAnswer = [
    check('body')
    .trim()
    .not()
    .isEmpty()
    .withMessage('body is missing')
    .isLength({min: 10})
    .withMessage('body must at least 10 words long')
]

const validation = (req, res, next) => {
    const error = validationResult(req).array();
    if(error.length > 0){
        console.log(error[0]);
        return sendError(res, error[0].msg);
    }
    next()
    };


    module.exports = {
        validateSignup,
        validateQuestion,
        validateAnswer,
        validation
    }