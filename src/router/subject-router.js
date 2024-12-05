const express = require('express');
const { verifyLoginAdminToken } = require('../controller/admin-auth-controller');
const { subjectImgUpload } = require('../utils/file');
const { createSubject, updatedSubject, searchSingleSubject, deletedSubject, fetchAll } = require('../controller/subject-controller');
const router = express.Router();

router.post('/create-subject', verifyLoginAdminToken, subjectImgUpload, createSubject);
router.put('/update-subject/:id', verifyLoginAdminToken, subjectImgUpload, updatedSubject);
router.get('/search', searchSingleSubject);
router.get('/fetch-all', fetchAll);
router.delete('/delete-subject/:id', deletedSubject);
 

module.exports = router