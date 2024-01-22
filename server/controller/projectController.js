const Project = require('../model/projectModel');

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

module.exports = {
  addProject, getProject
};
