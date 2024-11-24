const express = require('express');
const { signUp } = require('../controller/user-Controller');
const { sendUserEmail, userTokenEmail, loginsessionEmail } = require('../../service/userEmailTemp');
const { validateSignup, validation } = require('../middleware/validator');
const { userExistence } = require('../middleware/user');
const { 
    checkUserExistence, 
    loginAttempt, 
    generateVerificationToken, 
    verifyLogin, 
    loginUserIn, 
    verifyLoginAdminToken, 
    logOut } = require('../controller/user-auth-controller');
const router = express.Router()


router.post('/create-user', validateSignup, validation, userExistence, signUp, sendUserEmail);
router.post('/login', checkUserExistence, loginAttempt, generateVerificationToken, userTokenEmail);
router.post('/login-session/:userId', verifyLogin, loginUserIn);
router.get('/verifySession',  verifyLoginAdminToken, loginsessionEmail);
router.get('/logout',  logOut);

module.exports = router;