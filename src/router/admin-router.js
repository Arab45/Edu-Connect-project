const express = require('express');
const { signUp, adminLoginId, loginAttempt, verifyLoginAdminToken, logOut, forgetPasswordToken, resetPassword } = require('../controller/admin-auth-controller');
const { adminExistence } = require('../middleware/admin');
const { validateSignup, validation } = require('../middleware/validator');
const { sendAdminEmail, adminSessionEmail, adminresetPasswordEmail, adminresetPasswordSuccess } = require('../../service/userEmailTemp');
const router = express.Router()

router.post('/sign-up', validateSignup, validation, adminExistence, signUp, sendAdminEmail);
router.post('/login', adminLoginId, loginAttempt);
router.get('/login-session', verifyLoginAdminToken, adminSessionEmail);
router.get('/logout', logOut);
router.post('/forget-password', forgetPasswordToken, adminresetPasswordEmail);
router.post('/reset-password/:token', resetPassword, adminresetPasswordSuccess);

module.exports = router