const express = require('express');
const projectController = require('../controller/projectController');

const router = express.Router();

// Route to handle adding an assignment
router.post('/add/project', projectController.addProject);
router.get('/get/project', projectController.getProject);
// router.put('/update/assign/:id', eventController.updateAssignment);
// router.delete('/delete/assign/:id',eventController.deleteAssignment);

module.exports = router;