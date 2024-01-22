const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  start: Date,
  end: Date,
  allDay: Boolean,
  project: String,
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;