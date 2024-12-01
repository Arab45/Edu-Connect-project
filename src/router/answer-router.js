const express = require('express');
const { createAnswer, fetchAllAnswer, fetchSingleAnswer, deletedAnswer, updatedAnswer } = require('../controller/answer-controller');
const { validateAnswer, validation } = require('../middleware/validator');
const router = express.Router();


router.post('/create-question', validateAnswer, validation, createAnswer);
router.get('/fetch-all', fetchAllAnswer);
router.get('/fetch-single/:id', fetchSingleAnswer);
router.put('/update-answer/:id', updatedAnswer);
router.delete('/delete-answer/:id', deletedAnswer);

module.exports = router;