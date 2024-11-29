const express = require('express');
const { createAnswer, fetchAllAnswer, fetchSingleAnswer, deletedAnswer, updatedAnswer } = require('../controller/answer-controller');
const router = express.Router();


router.post('/create-question', createAnswer);
router.get('/fetch-all', fetchAllAnswer);
router.get('/fetch-single/:id', fetchSingleAnswer);
router.put('/update-question/:id', updatedAnswer);
router.delete('/delete-question/:id', deletedAnswer);

module.exports = router;