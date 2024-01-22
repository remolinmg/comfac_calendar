const Event = require('../model/eventsModel');

// Controller to handle adding an assignment
const addAssignment = async (req, res) => {
  try {
    const newEvent = req.body;

    // Save the newEvent to the database
    const createdEvent = await Event.create(newEvent);

    res.status(201).json(createdEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAssignment = async (req,res) =>{
  try {
    const data = await Event.find();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const updateAssignment = async (req, res) => {
  const id = req.params.id;
  const updatedData= req.body;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,updatedData,{ new: true } 
    );

    if (!updatedEvent ) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    const deletedDocument = await Event.findByIdAndDelete(req.params.id);
    if (!deletedDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAssignmentPeople = async (req, res) => {
    const { project, startTime, endTime } = req.query;
  
    try {
      const data = await Event.find({ project:project, start: startTime, end: endTime });
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

module.exports = {
  addAssignment,getAssignment,updateAssignment,deleteAssignment,getAssignmentPeople
};