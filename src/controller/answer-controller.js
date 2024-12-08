const { sendError, sendSuccess } = require("../middleware");
const Answer = require("../models/Answer");


const createAnswer = async (req, res) => {

    if (!req.files) {
        return sendError(res, "answer image is missing");
      };
      const rawImageArray = req?.files["diagram_image"];
      const namedImage = rawImageArray.map((a) => a.filename);
      const stringnifiedImage = JSON.stringify(namedImage);
      const formatedImage = stringnifiedImage.replace(/[^a-zA-Z0-9_.,]/g, "");
    console.log('my formated image', formatedImage);
    
        
    req.body.diagram_image = formatedImage;
   
    const newAnswer = new Answer({
        ...req.body
    });


    try {
       const createAnswer = await newAnswer.save();
       return sendSuccess(res, 'successfully create new answer', createAnswer)
    } catch (error) {
       console.log(error);
       return sendError(res, 'Unable to perform the operation, something went wrong', 500); 
    }
};

const fetchAllAnswer = async (req, res) => {
  let { page, pageSize } = req.query;


  page = parseInt(page, 10) || 1;
  pageSize = parseInt(pageSize, 10) || 5;


  try {
      const allAnswer = await Answer.aggregate([
          {
            $facet: {
              metadata: [{ $count: 'totalCount' }],
              data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
            },
          },
        ]);

        const data = {
          allProfile: {
              metadata: { totalCount: allAnswer[0].metadata[0].totalCount, page, pageSize },
              data: allAnswer[0].data,
            },
        };

        return sendSuccess(res, 'succcessfully fetch data', data, allAnswer);
  } catch (error) {
      console.log(error);
      return sendError(res, 'Unable to perform this action, something went wrong', 500);
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
  
    if (req.files) {
      const rawImageArray = req?.files["diagram_image"];
      if (rawImageArray) {
        const namedImage = rawImageArray.map((a) => a.filename);
        const stringnifiedImage = JSON.stringify(namedImage);
        const formatedImage = stringnifiedImage.replace(/[^a-zA-Z0-9_.,]/g, "");
        req.body.diagram_image = formatedImage;


        const currentMenuData = await Subject.findById(req.params.id);
        if (currentMenuData) {
          const fileToDelete = currentMenuData.subject_image;
          const filePath = path.join('public/files/imgs/diagrams', fileToDelete);
          await fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Error deleting file: ${err.message}`);
                return;
            }
            console.log('File deleted successfully!');
        });

          }

      }
    }
  
    try {
      const updatedItem = await Subject.findByIdAndUpdate(
        id,
        { $set: req.body },
        { now: true }
      );
      if (!updatedItem) {
        return sendError(res, "Unable to update the data. Data does not exist");
      }
      return sendSuccess(res, "Successfully updated the data", updatedItem);
    } catch (error) {
      console.log(error);
      return sendError(res, 'something went wrong', 500);
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