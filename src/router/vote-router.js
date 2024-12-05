const express = require('express');
const { createVote, fetchAllVote } = require('../controller/uservote-controller');
const router = express.Router();

router.post('/create-vote', createVote);
router.get('/fetch-vote', fetchAllVote);

module.exports = router