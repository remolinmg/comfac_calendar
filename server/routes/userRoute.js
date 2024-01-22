const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/get/userprofile/:id',  userController.getUserProfile);
router.put('/update/user/:id', userController.updateUser);
router.get('/get/user',  userController.getUser);
module.exports = router;