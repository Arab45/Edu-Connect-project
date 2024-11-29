const express = require('express');
const { createQuestion, fetchSingleQuestion, fetchAllQuestion, updatedQuestion, deletedQuestion } = require('../controller/question-controller');
const { validateQuestion, validation } = require('../middleware/validator');
const router = express.Router()


router.post('/create-question', validateQuestion, validation, createQuestion);
router.get('/single-question/:id', fetchSingleQuestion);
router.get('/all-question', fetchAllQuestion);
router.put('/updated-question/:id', updatedQuestion);
router.delete('/deleted-question/:id', deletedQuestion);


module.exports = router