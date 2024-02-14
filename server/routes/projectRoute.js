const express = require('express');
const projectController = require('../controller/projectController');

const router = express.Router();

// Route to handle adding an assignment
router.post('/add/project', projectController.addProject);
router.get('/get/project', projectController.getProject);
// router.put('/update/assign/:id', eventController.updateAssignment);
router.delete('/delete/project/:id',projectController.deleteProject);
router.post('/duplicate/project',projectController.duplicateProject);
module.exports = router;