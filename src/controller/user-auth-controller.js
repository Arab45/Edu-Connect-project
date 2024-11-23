const { sendError, sendSuccess } = require("../middleware");
const bcrypt = require('bcryptjs');
const { generateOTP } = require('../middleware/index');
const verificationToken = require("../models/verificationToken");
const User = require("../models/User");

const checkUserExistence = async (req, res, next) => {
    const { logInID, password } = req.body;

    try {
        const checkuserExist = await User.findOne({email: logInID})
        if(!checkuserExist){
            return sendError(res, 'email does not exist, signup instead');
        };
        req.body = { logInID, checkuserExist, password }
        next()
    } catch (error) {
        return sendError(res, 'Something when wronggggg', 500);
    }
};

const loginAttempt = async (req, res, next) => {
    const { logInID, checkuserExist, password } = req.body;

    try {
        const hashpassword = checkuserExist.password;
        const isPasswordCorrect = bcrypt.compareSync(password, hashpassword);
        if(!isPasswordCorrect){
            return sendError(res, 'Invalid password provided');
        }
        req.body = { checkuserExist, password };
        next();
    } catch (error) {
        return sendError(res, 'Something when wrong', 500); 
    }
};

const generateVerificationToken = async (req, res, next) => {
    const { checkuserExist } = req.body;

    const otp = generateOTP(6);
    console.log(otp);
    const hashToken = bcrypt.hashSync(otp);

    const existingUserVToken = await verificationToken.findOne({owner: checkuserExist._id});
    if(existingUserVToken){
        try {
            await verificationToken.findByIdAndDelete(existingUserVToken._id);
        } catch (error) {
            console.log(error);
            console.log('Unable to verify that there is no token already generate for this admin.');
        } 
        return sendError(res, 'Something went wrong, please try againnnnnn.');
    }

    const newVerificationToken = new verificationToken({
        owner: checkuserExist._id,
        token: hashToken
    });

    try{
        await newVerificationToken.save()
        req.body = { checkuserExist, otp };
        next()
    } catch (error) {
        console.log(error);
        console.log('Unable to verify that there is token already generate for this admin.')
        return sendError(res, 'Unable to login. Something went wrong', 500);  
    }
};

//Verifying the user LOGIN with the OTP/ID
const verifyLogin = async (req, res, next) => {
    const {otp} = req.body;
    const {userId} = req.params;

    if(!isValidObjectId(userId)){
        return sendError(res, 'Invalid ID supplied, please try again.');
    };
    

    try {
        const userToken = await verificationToken.findOne({owner: userId});
        if(!userToken){
            return sendError(res, 'No login attempt detected. Please try again');
        };

        const hashToken = userToken.token;
        const isTokenCorrect = bcrypt.compareSync(otp, hashToken);
        if(!isTokenCorrect){
            return sendError(res, 'Please provide a valid token. Please try again');   
        };

        try {
            const user = await User.findById(adminId);
            req.body = { user };
           // return sendSuccess(res, 'Successfully confirm otp.', admin)
            next();
        } catch (error) {
            console.log(error);
            return sendError(res, 'Invalid token provided.', 500); 
        }
    } catch (error) {
        console.log(error);
        return sendError(res, 'Unable to verify login. Something went wrong.');
    }
};


//Authenticating the user Login credentials
const loginAdminIn = (req, res, next) => {
    const { user } = req.body;

    //Encoding the user payload
    const loginToken = jwt.sign({userId: user._id}, 
        process.env.JWT_ADMIN_SECRET, {expiresIn: '1d'});

        //Creating both server/browser cookies
        res.cookie(String(user._id), loginToken, {
            path: '/',
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
            httpOnly: true,
            sameSite: 'lax'
        });

        req.body = { user, loginToken };
        next();
    
};


//Authorized user Admin credentials
const verifyLoginAdminToken = (req, res, next) => {
    const cookie = req.headers.cookie;

    if(!cookie){
        return sendError(res, 'No cookie found, You are not authorize to access this resource.');
    };

    const token = cookie.split('=')[1];
    if(!token){
        return sendError(res, 'No session cookie found, login first');
    };

    //Decoding Admin token
    jwt.verify(String(token), process.env.JWT_ADMIN_SECRET, (error, success) => {
        if(error){
            return sendError(res, 'Your session cannot be verified, you are not authorize to access this resource')
        };

        //custom rquest id
      req.id = success.adminId;
      next();
    })
};


//Logout funtion for user 
const logOut = (req, res) => {
    const cookie = req.headers.cookie;
    if(!cookie){
        return sendError(res, 'No cookie found, You are not authorize to access this resource.');
    };

    //Extracting my token from perticular user
    const token = cookie.split('=')[1];
    if(!token){
        return sendError(res, 'No session cookie found, login first');
    };

    //Decoding my cookies
    jwt.verify(String(token), process.env.JWT_ADMIN_SECRET, (error, success) => {
        if(error){
            return sendError(res, 'Your session cannot be verified, you are not authorize to access this resource')
        };
         });

         
         //clearing the cookie from my database
         res.clearCookie([`${success.adminId}`]);

         //setting the ID value to empty cokies. It also an array of available cookies
        //  res.cookies[`${success.adminId}`] = '';
        //  return sendError(res, 'Successfully logged out.')
};

module.exports = {
    checkUserExistence,
    loginAttempt,
    generateVerificationToken,
    verifyLogin,
    loginAdminIn,
    verifyLoginAdminToken,
    logOut
}