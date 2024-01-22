const User = require('../model/userModel');
const bcrypt = require('bcrypt');

// User signup
exports.signup = async (req, res) => {
    try {
        const { id, name, department, position, email, contact, password } = req.body;

        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        // Hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creating a new user with hashed password
        const newUser = new User({
            _id: id,
            name,
            department,
            position,
            email,
            contact,
            password: hashedPassword
        });
        await newUser.save();
        res.send('File and text data saved to MongoDB and Cloudinary');
      } catch (err) {
        console.error(err);
        res.status(500).send('Error saving data to MongoDB and Cloudinary');
      }
    };

//user login
exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      res.status(400).json({ message: 'All fields are required' });
      return; // Add this to prevent further execution
    }
  
    try {
      const user = await User.findOne({ email });
      if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
          res.status(201).json({
            email: user.email,
            id: user._id
          });
        } else {
          res.status(400).json({ message: 'Incorrect password' });
        }
      } else {
        res.status(400).json({ message: 'Account not found' });
      }
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Login Error' });
    }
  };

  exports.getUserProfile = async (req, res) => {
    try {
      const _id = req.params.id;
      const data = await User.find({ _id });
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.updateUser = async (req, res) => {
    const id = req.params.id;
    const {name,department,position,email,contact} = req.body;
    
  
    try {
      // First, find the existing user
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the user with new data (excluding the file)
      existingUser.set({_id:id,name,department,position,email,contact});
  
      const updatedUser = await existingUser.save();
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  exports.getUser = async (req, res) => {
    try {
      const data = await User.find();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };