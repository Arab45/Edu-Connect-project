const { registrationEmailATemp } = require("../public/registrationEmail");
const loginOTPtemp = require("../public/tokenTemp");
const { sendSuccess } = require("../src/middleware");
const sendMail = require("../src/utils/sendMail");


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

const userToken = async (req, res) => {
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

module.exports = {
    sendUserEmail,
    userToken
}