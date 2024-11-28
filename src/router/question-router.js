const express = require('express');
const { createQuestion, fetchSingleQuestion, fetchAllQuestion } = require('../controller/question-controller');
const { validateQuestion, validation } = require('../middleware/validator');
const router = express.Router()


router.post('/create-question', validateQuestion, validation, createQuestion);
router.get('/single-question/:id', fetchSingleQuestion);
router.get('/all-question', fetchAllQuestion);


module.exports = router