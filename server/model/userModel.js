const mongoose = require('mongoose');

const userRegistrationSchema = new mongoose.Schema({
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
password:{
    type:String,
    required: true,
}
});
const User = mongoose.model("User", userRegistrationSchema);
module.exports = User;