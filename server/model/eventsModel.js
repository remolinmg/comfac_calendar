const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  start: Date,
  end: Date,
  allDay: Boolean,
  company: String,
  project: String,
  name: String,
  department: String,
  fromtime: String,
  totime: String,
  hours: String,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;