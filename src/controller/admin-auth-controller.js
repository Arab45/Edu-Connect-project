const { sendSuccess, sendError } = require("../middleware");
const Admin = require("../models/Admin");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const signUp = async (req, res, next) => {
    req.body.email = req.body.email.toLowerCase();
    req.body.username = req.body.username.toLowerCase();

    const salt = bcrypt.genSaltSync(10);
    const hashpassword = bcrypt.hashSync(req.body.password, salt);

    req.body.password = hashpassword;

    const newAdmin = new Admin({ ...req.body });
    try {
        await newAdmin.save();
        req.body = { newAdmin };
        next();
    } catch (error) {
        console.log(error);
        return sendError(res, 'something went wrong', 500);
    }
};

const adminLoginId = async (req, res, next) => {
    const { logInID, password } = req.body;
    req.body.logInID = req.body.logInID.toLowerCase();

    try {
        const checkAdminExist = await Admin.findOne({email: logInID})
        if(!checkAdminExist){
            return sendError(res, 'email does not exist, signup instead');
        };
        req.body = { logInID, checkAdminExist, password }
        next()
    } catch (error) {
        console.log(error);
        return sendError(res, 'Something when wronggggg', 500);
    }
};

const loginAttempt = async (req, res, next) => {
    const { logInID, checkAdminExist, password } = req.body;

    try {
        const hashpassword = checkAdminExist.password;
        const isPasswordCorrect = bcrypt.compareSync(password, hashpassword);
        if(!isPasswordCorrect){
            return sendError(res, 'Invalid password provided');
        }
        
        const loginToken = jwt.sign({userId: checkAdminExist._id}, 
            process.env.JWT_ADMIN_SECRET, {expiresIn: '1d'});
    
            //Creating both server/browser cookies
            res.cookie(String(checkAdminExist._id), loginToken, {
                path: '/',
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
                httpOnly: true,
                sameSite: 'lax'
            });

            return sendSuccess(res, 'successfully create admin login session', checkAdminExist);
    } catch (error) {
        console.log(error);
        return sendError(res, 'Something when wrong', 500); 
    }
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
      req.id = success.userId;
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


         //clearing the cookie from my database
         res.clearCookie([`${success.userId}`]);
         return sendSuccess(res, 'Successfully logged out.');
         //setting the ID value to empty cokies. It also an array of available cookies
        //  res.cookies[`${success.adminId}`] = '';
        //  return sendError(res, 'Successfully logged out.')
         });

         
        
};

const forgetPasswordToken = async (req, res, next) => {
    const { email } = req.body;

    const admin = await Admin.findOne({email});
        if(!admin){
            return sendError(res, 'no user payload detected');
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        // const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
        const hashToken = bcrypt.hashSync(resetToken, 10);
    try {
         // Store the hash and expiration in the database
         admin.resetPaswordToken = hashToken;
         admin.resetPasswordExpiredAt = Date.now() + 1000 * 60 * 60 * 24;
         await admin.save()
         console.log(`Send this reset link: http://localhost:3000/reset-password/${resetToken}`);
        //  return sendSuccess(res, 'successfully create', user);
         req.body = { resetToken, admin };
         next();
    } catch (error) {
        console.log(error);
        return sendError(res, 'Something went wrong.');
    }
};

const resetPassword = async (req, res, next) => {
    const { token } = req.params;
    const { newPassword } = req.body;

   

    const admin = await Admin.findOne({ resetPasswordExpiredAt: {$gt: Date.now()} });

    if (!admin) {
    return sendError(res, "Invalid or expired token");
   }


   const hashToken = admin.resetPaswordToken;
   const isValidToken = bcrypt.compareSync(token, hashToken);
   if(!isValidToken){
    return sendError(res, 'invalid or expired token', 400);
   }

   // Hash the new 
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    // Update the user's password and clear the reset token
    admin.password = hashedPassword;
    admin.resetPaswordToken = undefined;
     admin.resetPasswordExpiredAt = undefined;


  try {
    const upadatePassword = await admin.save();
    // return sendSuccess(res, "Password reset successful", upadatePassword);
    req.body = { upadatePassword };
    next();
  } catch (error) {
    console.log(error);
    return sendError(res, 'Something went wrong.');
  }

  };

module.exports = {
    signUp,
    adminLoginId,
    loginAttempt,
    verifyLoginAdminToken,
    logOut,
    forgetPasswordToken,
    resetPassword
};