const { sendError, sendSuccess } = require("../middleware");
const Answer = require("../models/Answer");


const createAnswer = async (req, res) => {
    const { userId, questionId, body, diagram_image } = req.body;

    if (!req.files) {
        return sendError(res, "answer image is missing");
      };
      const rawImageArray = req?.files["diagram_image"];
      const namedImage = rawImageArray.map((a) => a.filename);
      const stringnifiedImage = JSON.stringify(namedImage);
      const formmatedImage = stringnifiedImage.replace(/[^a-zA-Z0-9_.,]/g, "");
    console.log('my formated image', formmatedImage);
    
        
    req.body.diagram_image = formmatedImage;
   
    const newAnswer = new Answer({
        userId,
        questionId,
        body,
        diagram_image
    });


    console.log("This is my question", newAnswer);
    try {
       const createAnswer = await newAnswer.save();
       return sendSuccess(res, 'successfully create new answer', createAnswer)
    } catch (error) {
       console.log(error);
       return sendError(res, 'Unable to perform the operation, something went wrong', 500); 
    }
};

const fetchAllAnswer = async (req, res) => {

    try {
    const allAnswer = await Answer.find();
    return sendError(res, "Sucessfully fetch all answer", allAnswer);
    } catch (error) {
        console.log(error);
        return sendError(res, "Unable to perform the operation, something went wrong", 500)
    }
};

const fetchSingleAnswer = async (req, res) => {
    const { id } = req.params

    try {
        const singleAnswer = await Answer.findById(id);
        if(!singleAnswer){
            return sendError(res, "unable to fetch single answer", 401);
        }
        return sendSuccess(res, "successfully fetch single answer", singleAnswer);
    } catch (error) {
       console.log(error);
       return sendError(res, 'Unable to perform the operation, something went wrong', 500); 
    }
};

const updatedAnswer = async (req, res) => {
    const { id } = req.params;

    try {
        const modifyAnswer = await Answer.findByIdAndUpdate(id, {$set: req.body}, {now: true});
        if(!modifyAnswer){
            return sendError(res, "Unable to fetch data");
        };
        return sendSuccess(res, "successfully update user answer", modifyAnswer);
    } catch (error) {
        console.log(error);
        return sendError(res, 'Unable to perform the operation, something went wrong', 500);
    }
};

const deletedAnswer = async (req, res) => {
    const { id } = req.params;

    try {
        const answerDeleted = await Answer.findByIdAndDelete(id);
        if(!answerDeleted){
            return sendError(res, 'unable to delete question');
        };
        return sendSuccess(res, 'successfully delete answer from the database', answerDeleted);
    } catch (error) {
        console.log(error);
        return sendError(res, 'Unable to perform the operation, something went wrong', 500);
    }
}

module.exports = {
    createAnswer,
    fetchAllAnswer,
    fetchSingleAnswer,
    updatedAnswer,
    deletedAnswer
}