const express = require('express');
const { signUp } = require('../controller/user-Controller');
const { sendUserEmail, userTokenEmail, loginsessionEmail, resetPasswordEmail } = require('../../service/userEmailTemp');
const { validateSignup, validation } = require('../middleware/validator');
const { userExistence } = require('../middleware/user');
const { 
    checkUserExistence, 
    loginAttempt, 
    generateVerificationToken, 
    verifyLogin, 
    loginUserIn, 
    verifyLoginAdminToken, 
    logOut, 
    resetPassword,
    forgetPasswordToken} = require('../controller/user-auth-controller');
const router = express.Router()


router.post('/create-user', validateSignup, validation, userExistence, signUp, sendUserEmail);
router.post('/login', checkUserExistence, loginAttempt, generateVerificationToken, userTokenEmail);
router.post('/login-session/:userId', verifyLogin, loginUserIn);
router.get('/verifySession',  verifyLoginAdminToken, loginsessionEmail);
router.get('/logout',  logOut);
router.post('/forget-password-token', forgetPasswordToken, resetPasswordEmail);
router.post('/reset-password/:token', resetPassword);

module.exports = router;