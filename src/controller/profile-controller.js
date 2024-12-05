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
    let { page, pageSize } = req.query;


    page = parseInt(page, 10) || 1;
    pageSize = parseInt(pageSize, 5) || 2;


    try {
        const allProfile = await Profile.aggregate([
            {
              $facet: {
                metadata: [{ $count: 'totalCount' }],
                data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
              },
            },
          ]);

          const data = {
            allProfile: {
                metadata: { totalCount: allProfile[0].metadata[0].totalCount, page, pageSize },
                data: allProfile[0].data,
              },
          };

          return sendSuccess(res, true, data, allProfile);
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