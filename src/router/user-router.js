const express = require('express');
const { signUp } = require('../controller/user-Controller');
const { sendUserEmail, userToken } = require('../../service/userEmailTemp');
const { validateSignup, validation } = require('../middleware/validator');
const { userExistence } = require('../middleware/user');
const { checkUserExistence, loginAttempt, generateVerificationToken, verifyLogin, loginAdminIn } = require('../controller/user-auth-controller');
const router = express.Router()


router.post('/create-user', validateSignup, validation, userExistence, signUp, sendUserEmail);
router.post('/login', checkUserExistence, loginAttempt, generateVerificationToken, userToken);
router.post('/login-session', verifyLogin, loginAdminIn);

module.exports = router;