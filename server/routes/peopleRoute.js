const express = require('express');
const router = express.Router();
const peopleController = require('../controller/peopleController');

router.post('/signuppeople', peopleController.signuppeople);
router.get('/get/peopleprofile/:id',  peopleController.getPeopleProfile);
router.put('/update/people/:id', peopleController.updatePeople);
router.get('/get/people',  peopleController.getPeople);
module.exports = router;