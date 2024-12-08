const { sendSuccess, sendError } = require("../middleware");
const Vote = require("../models/Vote");

const createVote = async (req, res) => {
     const adminId = req.id;
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

const fetchAllVote = async (req, res) => {
   let { page, pageSize } = req.query;
 
 
   page = parseInt(page, 10) || 1;
   pageSize = parseInt(pageSize, 10) || 5;
 
 
   try {
       const allVote = await Subject.aggregate([
           {
             $facet: {
               metadata: [{ $count: 'totalCount' }],
               data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
             },
           },
         ]);
 
         const data = {
            allVote: {
               metadata: { totalCount: allVote[0].metadata[0].totalCount, page, pageSize },
               data: allVote[0].data,
             },
         };
 
         return sendSuccess(res, 'succcessfully fetch data', data, allVote);
   } catch (error) {
       console.log(error);
       return sendError(res, 'Unable to perform this action, something went wrong', 500);
   }
 };

const deletedVote = async () => {
   const { id } = req.params;

   try {
      const vote = await Vote.findByIdAndDelete(id);
      if(!vote){
         return sendError('user vote does not exist');
      };
      return sendSuccess(res, 'user vote has been deleted successfully', vote);
   } catch (error) {
      console.log(error);
       return sendError(res, 'Unable to perform this action, something went wrong', 500); 
   }
};


module.exports = {
    createVote,
    fetchAllVote,
    deletedVote
}