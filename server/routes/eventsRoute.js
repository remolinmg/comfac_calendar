const express = require('express');
const eventController = require('../controller/eventsController');

const router = express.Router();

// Route to handle adding an assignment
router.post('/add/assign', eventController.addAssignment);
router.get('/get/assignpeople', eventController.getAssignmentPeople);
router.put('/update/assign/:id', eventController.updateAssignment);
router.delete('/delete/assign/',eventController.deleteAssignment);

module.exports = router;