const { sendError, sendSuccess } = require("../middleware");
const Admin = require("../models/Admin");
const Subject = require("../models/Subject");
const path = require('path');
const fs = require('fs');

const createSubject = async (req, res) => {
    const adminId = req.id;


    if (!req.files) {
      return sendError(res, "Subject cover image is missing");
    };
    const rawImageArray = req?.files["subject_image"];
    const namedImage = rawImageArray.map((a) => a.filename);
    const stringnifiedImage = JSON.stringify(namedImage);
    const formmatedImage = stringnifiedImage.replace(/[^a-zA-Z0-9_.,]/g, "");
  console.log('my formated image', formmatedImage);
    try {
      const admin = await Admin.findById(adminId);
      if (!admin) {
        return sendError(res, "You are not authorised.");
      }
      req.body.added_by = admin.username;
      req.body.subject_image = formmatedImage;
      try {
        const newSubject = new Subject({ ...req.body });
        await newSubject.save();
        return sendSuccess(
          res,
          "Successfully added a new subject picture",
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
        const formmatedImage = stringnifiedImage.replace(/[^a-zA-Z0-9_.,]/g, "");
        req.body.item_image = formmatedImage;

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
      const updatedItem = await Subject.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );
      console.log("updatedItem", updatedItem);
      if (!updatedItem) {
        return sendError(res, "Unable to update the data. Data does not exist");
      }
      return sendSuccess(res, "Successfully updated the data", updatedItem);
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
      return sendError(res, 'data does not exist');
      };
      return sendSuccess(res, 'successfully fetch data', outcome);
    } catch (error) {
      console.log(error);
      return sendError(res, 'something went wrong', 500);
    }
  };

  const fetchAll = async (req, res) => {
    try {
      const allSubject = await Subject.find();
      if(!allSubject){
        return sendError(res, 'unable to fetch all subject');
      };
      return sendSuccess(res, 'successfully fetch all subject', allSubject);
    } catch (error) {
      console.log(error);
      return sendError(res, 'something went wrong', 500);
    }
  }

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