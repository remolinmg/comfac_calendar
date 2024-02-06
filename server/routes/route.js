const express = require('express');
const router = express.Router();
const userSample = require('../controller/controller');

router.post('/addsample', userSample.postSample);
module.exports = router;