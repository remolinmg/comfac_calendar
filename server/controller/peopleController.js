const People = require("../model/peopleModel");

// People signup
exports.signuppeople = async (req, res) => {
  try {
    const { id, name, department, position, email, contact } = req.body;

    // Creating a new people with hashed password
    const newPeople = new People({
      _id: id,
      name,
      department,
      position,
      email,
      contact,
    });
    await newPeople.save();
    res.send("File and text data saved to MongoDB and Cloudinary");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving data to MongoDB and Cloudinary");
  }
};

exports.getPeopleProfile = async (req, res) => {
  try {
    const _id = req.params.id;
    const data = await People.find({ _id });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updatePeople = async (req, res) => {
  const id = req.params.id;
  const { name, department, position, email, contact } = req.body;

  try {
    // First, find the existing people
    const existingPeople = await People.findById(id);
    if (!existingPeople) {
      return res.status(404).json({ message: "People not found" });
    }

    // Update the people with new data (excluding the file)
    existingPeople.set({ _id: id, name, department, position, email, contact });

    const updatedPeople = await existingPeople.save();

    res.status(200).json(updatedPeople);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getPeople = async (req, res) => {
  try {
    const data = await People.find();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
