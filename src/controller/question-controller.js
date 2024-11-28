const { sendError, sendSuccess } = require("../middleware");
const Question = require("../models/Question")

const createQuestion = async (req, res) => {
    const { owner, title, body } = req.body;
   
    const newQuestion = new Question({
        owner,
        title,
        body
    });


    console.log("This is my question", newQuestion);
    try {
       const createQuestion = await newQuestion.save();
       return sendSuccess(res, 'successfully send question', createQuestion)
    } catch (error) {
       console.log(error);
       return sendError(res, 'Unable to perform the operation, something went wrong', 500); 
    }
};

const fetchAllQuestion = async (req, res) => {

    try {
    const allQuestion = await Question.find();
    return sendError(res, "Sucessfully fetch all question", allQuestion);
    } catch (error) {
        console.log(error);
        return sendError(res, "Unable to perform the operation, something went wrong", 500)
    }
};

const fetchSingleQuestion = async (req, res) => {
    const { id } = req.params

    try {
        const singleQuestion = await Question.findById(id);
        if(!singleQuestion){
            return sendError(res, "unable to fetch single user", 401);
        }
        return sendSuccess(res, "successfully fetch single question", singleQuestion);
    } catch (error) {
       console.log(error);
       return sendError(res, 'Unable to perform the operation, something went wrong', 500); 
    }
};

const updatedQuestion = async (req, res) => {
    const { id } = req.params;

    try {
        const modifyQuestion = await Question.findByIdAndUpdate(id, {$set: req.body}, {now: true});
        if(!modifyQuestion){
            return sendError(res, "Unable to fetch data");
        };
        return sendSuccess(res, "successfully update user question", modifyQuestion);
    } catch (error) {
        console.log(error);
        return sendError(res, 'Unable to perform the operation, something went wrong', 500);
    }
};

const deletedQuestion = async (req, res) => {
    const { id } = req.params;

    try {
        const questionDeleted = await Question.findByIdAndDelete(id);
        if(!questionDeleted){
            return sendError(res, 'unable to delete question');
        };
        return sendSuccess(res, 'successfully delete question from the database', questionDeleted);
    } catch (error) {
        console.log(error);
        return sendError(res, 'Unable to perform the operation, something went wrong', 500);
    }
}

module.exports = {
    createQuestion,
    fetchAllQuestion,
    fetchSingleQuestion,
    updatedQuestion,
    deletedQuestion
}