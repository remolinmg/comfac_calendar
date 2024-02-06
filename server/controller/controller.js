// controllers/projectController.js
const Sample = require('../model/model');

// Route to handle project data submission
exports.postSample = async (req, res) => {
  try {
    const { projectName, employees } = req.body;

    // Loop through each employee and save them individually
    const savedEmployees = [];
    for (const employee of employees) {
      const newSample = new Sample({
        projectName,
        employees: employee,
      });
      const savedSample = await newSample.save();
      savedEmployees.push(savedSample);
    }

    res.status(201).json({ savedEmployees });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
