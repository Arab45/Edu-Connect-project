const express = require('express');
const { signUp, fetchSingleUser, fetchAllUser } = require('../controller/user-controller');
const { sendUserEmail, userTokenEmail, loginsessionEmail, resetPasswordEmail, emailPasswordSuccess } = require('../../service/userEmailTemp');
const { validateSignup, validation } = require('../middleware/validator');
const { userExistence } = require('../middleware/user');
const { 
    checkUserExistence, 
    loginAttempt, 
    generateVerificationToken, 
    verifyLogin, 
    loginUserIn, 
    verifyLoginUserToken, 
    logOut, 
    resetPassword,
    forgetPasswordToken} = require('../controller/user-auth-controller');
const router = express.Router()


router.post('/create-user', validateSignup, validation, userExistence, signUp, sendUserEmail);
router.post('/login', checkUserExistence, loginAttempt, generateVerificationToken, userTokenEmail);
router.post('/login-session/:userId', verifyLogin, loginUserIn);
router.get('/verifySession',  verifyLoginUserToken, loginsessionEmail);
router.get('/logout',  logOut);
router.post('/forget-password-token', forgetPasswordToken, resetPasswordEmail);
router.post('/reset-password/:token', resetPassword, emailPasswordSuccess);
router.get('/single-user/:id', fetchSingleUser);
router.get('/all-user', fetchAllUser);

module.exports = router;