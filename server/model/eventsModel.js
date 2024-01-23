const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  ID:String,
  Company: String,
  Project: String,
  Employee: String,
  Department: String,
  Series:String,
  ID_Time_Sheet:String,
  From_Time: String,
  To_Time: String,
  Project_Name:String,
  Hrs: String,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;