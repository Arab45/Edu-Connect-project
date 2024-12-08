const { sendError, sendSuccess } = require("../middleware");
const Admin = require("../models/Admin");
const Subject = require("../models/Subject");
const path = require('path');
const fs = require('fs');

const createSubject = async (req, res) => {
    const adminId = req.id;


    if (!req.files) {
      return sendError(res, 'Subject cover image is missing');
    };
    const rawImageArray = req?.files['subject_image'];
    const namedImage = rawImageArray.map((a) => a.filename);
    const stringnifiedImage = JSON.stringify(namedImage);
    const formatedImage = stringnifiedImage.replace(/[^a-zA-Z0-9_.,]/g, "");
  console.log('my formated image', formatedImage);
    try {
      const admin = await Admin.findById(adminId);
      if (!admin) {
        return sendError(res, 'You are not authorised.');
      }
      req.body.added_by = admin.username;
      req.body.subject_image = formatedImage;
      try {
        const newSubject = new Subject({ ...req.body });
        await newSubject.save();
        return sendSuccess(
          res,
          'Successfully added a new subject picture',
          newSubject
        );
      } catch (error) {
        console.log(error);
        return sendError(res, 'something went wrong', 500);
      }
    } catch (error) {
        console.log(error);
      return sendError(res, "something went wrong", 500);
    }
  };


  const updatedSubject = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    console.log("req.body", req.body);
  
    if (req.files) {
      const rawImageArray = req?.files["subject_image"];
      if (rawImageArray) {
        const namedImage = rawImageArray.map((a) => a.filename);
        const stringnifiedImage = JSON.stringify(namedImage);
        const formatedImage = stringnifiedImage.replace(/[^a-zA-Z0-9_.,]/g, "");
        req.body.item_image = formatedImage;

        const currentMenuData = await Subject.findById(req.params.id);
        if (currentMenuData) {
          const fileToDelete = currentMenuData.subject_image;
          const filePath = path.join('public/files/imgs/subjects', fileToDelete);
          await fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Error deleting file: ${err.message}`);
                return;
            }
            console.log('File deleted successfully!');
        });
          // Handle file delete from disk by yourself
        }

      }
    }
  
    try {
      const updatedSubject = await Subject.findByIdAndUpdate(
        id,
        { $set: req.body },
        { now: true }
      );
      if (!updatedSubject) {
        return sendError(res, "Unable to update the data. Data does not exist");
      }
      return sendSuccess(res, "Successfully updated the data", updatedSubject);
    } catch (error) {
      console.log(error);
      return sendError(res, 'something went wrong', 500);
    }
  };

  const searchSingleSubject = async (req, res) => {
    const subject  = req.query.subject;

    
    const capitalizeSubject = subject.charAt(0).toUpperCase() + subject.slice(1);

    try {
      const availableSubject = await Subject.find();
      const outcome = availableSubject.filter((a) => a.subject === capitalizeSubject);

      if(outcome.length === 0){
      return sendError(res, 'No such data exist');
      };
      return sendSuccess(res, 'successfully fetch data', outcome);
    } catch (error) {
      console.log(error);
      return sendError(res, 'something went wrong', 500);
    }
  };

  const fetchAll = async (req, res) => {
    let { page, pageSize } = req.query;
  
  
    page = parseInt(page, 10) || 1;
    pageSize = parseInt(pageSize, 10) || 5;
  
  
    try {
        const allSubject = await Subject.aggregate([
            {
              $facet: {
                metadata: [{ $count: 'totalCount' }],
                data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
              },
            },
          ]);
  
          const data = {
            allSubject: {
                metadata: { totalCount: allSubject[0].metadata[0].totalCount, page, pageSize },
                data: allSubject[0].data,
              },
          };
  
          return sendSuccess(res, 'succcessfully fetch data', data, allSubject);
    } catch (error) {
        console.log(error);
        return sendError(res, 'Unable to perform this action, something went wrong', 500);
    }
  };

  const deletedSubject = async (req, res) => {
    const { id } = req.params;

    try {
      const deleteSubject = await Subject.findByIdAndDelete(id);
      if(!deleteSubject){
        return sendError(res, 'unable to delete subject')
      };
      return sendError(res, 'successfully deleted one single subject')
    } catch (error) {
      console.log(error);
      return sendError(res, 'something went wrong', 500);
    }
  };


  module.exports = {
    createSubject,
    updatedSubject,
    searchSingleSubject,
    fetchAll,
    deletedSubject
  }