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

module.exports = {
  addProject, getProject,deleteProject
};
