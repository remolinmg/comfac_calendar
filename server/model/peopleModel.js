const mongoose = require('mongoose');

const peopleRegistrationSchema = new mongoose.Schema({
_id:{
    type:String,
    required: true,
},
name:{
    type:String,
    required: true,
},
department:{
    type:String,
    required: true,
},
position:{
    type:String,
    required: true,
},
email:{
    type:String,
},
contact:{
    type:String,
    required: true,
},
});
const People = mongoose.model("People", peopleRegistrationSchema);
module.exports = People;