const express = require('express');
const { createProfile, fetchAllProfile, updatedProfile, deletedProfile } = require('../controller/profile-controller');
const { validateProfile, validation } = require('../middleware/validator');
const { verifyLoginAdminToken } = require('../controller/admin-auth-controller');
const router = express.Router();

router.post('/create-profile',  verifyLoginUserToken, validateProfile, validation, createProfile);
router.get('/fetch-all-profile', fetchAllProfile);
router.put('/update-profile/:id', updatedProfile);
router.delete('/delete-profile/:id', deletedProfile);

module.exports = router