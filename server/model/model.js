// models/projectModel.js
const mongoose = require('mongoose');

const Sample = mongoose.model('Sample', {
  projectName: String,
  employees: String,
});

module.exports = Sample;
