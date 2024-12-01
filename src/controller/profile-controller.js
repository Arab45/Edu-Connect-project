const { sendError, sendSuccess } = require('../middleware/index');
const Profile = require('../models/Profile');


const createProfile = async (req, res) => {
    const newProfile = new Profile({
        ...req.body
    });

    try {
        await newProfile.save();
        return sendSuccess(res, 'successfully created user profile', newProfile)
    } catch (error) {
        console.log(error);
        return sendError(res, 'Unable to perform this action, something went wrong', 500);
    }
};

const fetchAllProfile = async (req, res) => {
    try {
       const allProfile = await Profile.find();
       if(!allProfile){
        return sendError(res, 'profile not detected');
       };
       return sendSuccess(res, 'successfully fetch all profile', allProfile);
    } catch (error) {
        console.log(error);
        return sendError(res, 'Unable to perform this action, something went wrong', 500);
    }
};

const updatedProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const profileU = await Profile.findByIdAndUpdate(id, {$set: req.body}, {now: true});
        if(!profileU){
            return sendError(res, "Unable to fetch data");
        };
        return sendSuccess(res, 'successfully update user profile', profileU);
    } catch (error) {
       console.log(error);
       return sendError(res, 'Unable to perform this action, something went wrong', 500); 
    }
};

const deletedProfile = async (req, res) => {
    const { id } = req.params;
    try {
      const profileD = await Profile.findByIdAndDelete(id);
      if(!profileD){
        return sendError(res, "Unable to fetch data");
    };
    return sendSuccess(res, 'successfully delete user profile', profileD);  
    } catch (error) {
        console.log(error);
       return sendError(res, 'Unable to perform this action, something went wrong', 500); 
    }
};

module.exports = {
    createProfile,
    fetchAllProfile,
    updatedProfile,
    deletedProfile
}