const express = require('express');
const { createAnswer, fetchAllAnswer, fetchSingleAnswer, deletedAnswer, updatedAnswer } = require('../controller/answer-controller');
const { validateAnswer, validation } = require('../middleware/validator');
const { answerImgUpload } = require('../utils/file');
const router = express.Router();


router.post('/create-question', answerImgUpload, createAnswer);
router.get('/fetch-all', fetchAllAnswer);
router.get('/fetch-single/:id', fetchSingleAnswer);
router.put('/update-answer/:id', answerImgUpload, updatedAnswer);
router.delete('/delete-answer/:id', deletedAnswer);

module.exports = router;