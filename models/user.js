var mongoose = require('mongoose');
 
module.exports = mongoose.model('User',{
    userName: String,
    name: String,
    password: String,
    email: String
});