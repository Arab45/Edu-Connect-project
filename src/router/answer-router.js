const express = require('express');
const { createAnswer, fetchAllAnswer, fetchSingleAnswer, deletedAnswer, updatedAnswer } = require('../controller/answer-controller');
const router = express.Router();


router.post('/create-question', createAnswer);
router.get('/fetch-all', fetchAllAnswer);
router.get('/fetch-single', fetchSingleAnswer);
router.put('/update-question', updatedAnswer);
router.delete('/delete-question', deletedAnswer);

module.exports = router;