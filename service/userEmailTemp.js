const { registrationEmailATemp } = require("../public/registrationEmail");
const loginSessiontemp = require("../public/registrationSession");
const loginOTPtemp = require("../public/registratintokenTemp");
const { sendSuccess } = require("../src/middleware");
const sendMail = require("../src/utils/sendMail");
const User = require('../src/models/User');
const { resetPassTemp } = require("../public/resetPasswordEmailTemp");
const { resetPasswordSuccess } = require("../public/resetPasswordSuccess");


const sendUserEmail = async (req, res) => {
    const { newUser } = req.body;
    const email = newUser.email;
    const username = newUser.username;
    const subject = 'User account created';
    const body = registrationEmailATemp(username);

    try {
        sendMail(email, subject, body);
    } catch (error) {
        console.log(error.message);
        return sendSuccess(res, 'You have register but we can not send you a email at the moment');   
    }
    return sendSuccess(res, 'Email has been successfully send to you.', newUser);
};

const userTokenEmail = async (req, res) => {
    const { checkuserExist, otp } = req.body;
    const email = checkuserExist.email;
    const username = checkuserExist.username;
    const userID = checkuserExist._id;
    const subject = 'Verify that it is you!';
    const body = loginOTPtemp(username, otp);

    try {
        sendMail(email, subject, body);
    } catch (error) {
        console.log(error.message);
        return sendSuccess(res, 'Unable to send the OTP email. Please try again.');   
    }
    return sendSuccess(res, `Login OTP has been sent to your account email - ${email}`, userID)
};


const loginsessionEmail = async (req, res) => {
    const userId = req.id;
    const user = await User.findById(userId);
    console.log(user)
    const email = user.email;
    const username = user.username;
    const subject = 'Verify that it is you!';
    const body = loginSessiontemp(username);

    try {
        sendMail(email, subject, body);
    } catch (error) {
        console.log(error.message);
        return sendSuccess(res, 'Unable to send the OTP email. Please try again.');   
    }
    return sendSuccess( res, 'Email has been successfully send to you.', user );
};

const resetPasswordEmail = async (req, res) => {
   const { resetToken, user } = req.body;
    
    const email = user.email;
    const username = user.username;
    const subject = 'Verify that it is you!';
    const body = resetPassTemp( username, resetToken );

    try {
        sendMail(email, subject, body);
    } catch (error) {
        console.log(error.message);
        return sendSuccess(res, 'Unable to send the OTP email. Please try again.');   
    }
    return sendSuccess( res, 'Email has been successfully send to you.', user );
};


const emailPasswordSuccess = async (req, res) => {
    const { upadatePassword } = req.body;
    const email = upadatePassword.email;
     const username = upadatePassword.username;
     const subject = 'Successfully reset password!';
     const body = resetPasswordSuccess( username );
 
     try {
         sendMail(email, subject, body);
     } catch (error) {
         console.log(error.message);
         return sendSuccess(res, 'Unable to reset password. Please try again.');   
     }
     return sendSuccess( res, 'Email has been successfully send to you.', upadatePassword );
 };



module.exports = {
    sendUserEmail,
    userTokenEmail,
    loginsessionEmail,
    resetPasswordEmail,
    emailPasswordSuccess
}