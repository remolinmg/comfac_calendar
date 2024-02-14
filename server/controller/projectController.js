const Project = require('../model/projectModel');
const mongoose = require("mongoose");

// Controller to handle adding an assignments
const addProject = async (req, res) => {
  try {
    const newEvent = req.body;

    // Save the newEvent to the database
    const createdProject = await Project.create(newEvent);

    res.status(201).json(createdProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getProject = async (req,res) =>{
  try {
    const data = await Project.find();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}

const deleteProject = async (req, res) => {
  try {
    const deletedDocument = await Project.findByIdAndDelete(req.params.id);
    if (!deletedDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const duplicateProject = async (req, res) => {
  const newEvent = req.body;
  const { project, startTime, endTime } = req.query;

  try {
      const data = await Project.find({ Project: project, From_Time: startTime, To_Time: endTime });

      if (data && data.length > 0) {
          // Assuming data is an array, iterate over each item
          for (const item of data) {
              const duplicatedData = new Project({ ...item.toObject(), _id: new mongoose.Types.ObjectId() });
              Object.assign(duplicatedData, newEvent);
              await duplicatedData.save();
          }

          console.log('Documents duplicated and modified successfully.');
          res.status(201).json({ message: 'Documents duplicated and modified successfully.' });
      } else {
          console.log('Original documents not found.');
          res.status(404).json({ message: 'Original documents not found.' });
      }
  } catch (error) {
      console.error('Error duplicating and modifying documents:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  addProject, getProject,deleteProject,duplicateProject
};
