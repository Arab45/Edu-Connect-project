const express = require('express');
const { createVote, fetchAllVote, deletedVote } = require('../controller/uservote-controller');
const router = express.Router();

router.post('/create-vote', createVote);
router.get('/fetch-vote', fetchAllVote);
router.delete('/delete-vote', deletedVote);

module.exports = router