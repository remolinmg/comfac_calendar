const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  From_Time: String,
  To_Time: String,
  allDay: Boolean,
  Project: String,
  Project_Name: String,
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;