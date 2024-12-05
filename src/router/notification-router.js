const express = require('express');
const { notification } = require('../controller/notification-controller');
const router = express.Router()

router.get('/alert', notification);

module.exports = router