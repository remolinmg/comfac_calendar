const Event = require('../model/eventsModel');
const mongoose = require("mongoose");

// Controller to handle adding an assignment
const addAssignment = async (req, res) => {
  const newEvent = req.body;
  try {
    const check = await Event.findOne({ $and: [{ Project: newEvent.Project }, { Employee: newEvent.Employee }, { From_Time: newEvent.From_Time }, {To_Time: newEvent.To_Time}] })

    if(check){
      res.status(201).json({ success: true, createdEvent });
    }
    else{
    const employeeData = Array.isArray(newEvent.Employee)
      ? newEvent.Employee.map(employee => ({
          ID: newEvent.ID,
          Company: newEvent.Company,
          Project: newEvent.Project,
          Employee: employee,
          Department: newEvent.Department,
          Series: newEvent.Series,
          ID_Time_Sheet: newEvent.ID_Time_Sheet,
          From_Time: newEvent.From_Time,
          To_Time: newEvent.To_Time,
          Project_Name: newEvent.Project_Name,
          Hrs: newEvent.Hrs,
        }))
      : [
          {
            ID: newEvent.ID,
            Company: newEvent.Company,
            Project: newEvent.Project,
            Employee: newEvent.Employee,
            Department: newEvent.Department,
            Series: newEvent.Series,
            ID_Time_Sheet: newEvent.ID_Time_Sheet,
            From_Time: newEvent.From_Time,
            To_Time: newEvent.To_Time,
            Project_Name: newEvent.Project_Name,
            Hrs: newEvent.Hrs,
          },
        ];

    const createdEvent = await Event.insertMany(employeeData);

    res.status(201).json({ success: true, createdEvent });
  }
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
    const deletedDocument = await Event.findOneAndDelete(req.body);
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
      const data = await Event.find({ Project:project, From_Time: startTime, To_Time: endTime });
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const duplicateAssignedPeople = async (req, res) => {
    const newEvent = req.body;
    const { project, startTime, endTime } = req.query;

    try {
        const data = await Event.find({ Project: project, From_Time: startTime, To_Time: endTime });

        if (data && data.length > 0) {
            // Assuming data is an array, iterate over each item
            for (const item of data) {
                const duplicatedData = new Event({ ...item.toObject(), _id: new mongoose.Types.ObjectId() });
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
  addAssignment,getAssignment,updateAssignment,deleteAssignment,getAssignmentPeople,duplicateAssignedPeople
};