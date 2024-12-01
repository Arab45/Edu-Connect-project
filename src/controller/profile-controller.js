const { sendError, sendSuccess } = require('../middleware/index');
const Profile = require('../models/profile');

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
        const profile = await Profile.findByIdandUpdate(id, {$set: req.body}, {now: true});
        if(!profile){
            return sendError(res, "Unable to fetch data");
        };
        return sendSuccess(res, 'successfully update user profile', profile);
    } catch (error) {
       console.log(error);
       return sendError(res, 'Unable to perform this action, something went wrong', 500); 
    }
};

const deletedProfile = async (req, res) => {
    const { id } = req.params;
    try {
      const profile = await Profile.findByIdandDelete(id);
      if(!profile){
        return sendError(res, "Unable to fetch data");
    };
    return sendSuccess(res, 'successfully update user profile', profile);  
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