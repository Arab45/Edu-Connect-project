const { sendError, sendSuccess } = require("../middleware");
const User = require("../models/User");
const bcrypt = require('bcryptjs');

const signUp = async (req, res, next) => {
    req.body.email = req.body.email.toLowerCase();
    req.body.username = req.body.username.toLowerCase();

    const salt = bcrypt.genSaltSync(10);
    const hashpassword = bcrypt.hashSync(req.body.password, salt);

    req.body.password = hashpassword;

    const newUser = new User({ ...req.body })

    try {
        await newUser.save();
        console.log(newUser)
        // return sendSuccess(res, 'successfully register', newUser);
        req.body = { newUser }
        next();
    } catch (error) {
      return sendError(res, 'Something when wrong', 500);  
    }
};

module.exports = {
    signUp
}