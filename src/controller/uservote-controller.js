const { sendSuccess, sendError } = require("../middleware");
const Vote = require("../models/Vote");

const createVote = async (req, res) => {
     const { userId, voteValue} = req.body;

     const defaultValue = 0;

     const up_vote = Number(voteValue.upVote);
     const down_vote = Number(voteValue.downVote);

     const totalValue = defaultValue + up_vote;
     const downTotalValue = defaultValue + down_vote;
   //   console.log(`my total value is ${totalValue} and the downValue is ${downTotalValue}`);

     const newVote = new Vote({
        userId,
        voteValue: [
            {
                upVote: totalValue, 
                downVote: downTotalValue
            }
        ]
     });

     try {
        await newVote.save()
        return sendSuccess(res, 'vote has been created', newVote);
     } catch (error) {
        console.log(error);
        return sendError(res, 'something went wrong', 500);
     }

};

const fetchAllVote = async(req, res) => {
   try {
     const allVote = await Vote.find();
     if(!allVote){
      return sendError(res, 'no data exist');
     };
     return sendSuccess(res, "successfully fetch all data", allVote); 
   } catch (error) {
      console.log(error);
      return sendError(res, 'somethig went wrong', 500);
   }
};




module.exports = {
    createVote,
    fetchAllVote
}