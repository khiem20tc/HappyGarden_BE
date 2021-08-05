var mongoose = require('mongoose');

var userData = new mongoose.Schema({
    name: { 
        type: String, 
        require: true   
    },
    pass: {
        type: String, 
        require: true 
    },
    avatar:{
        type: Object,
        require: true,
    },
    vote :{
        type :Object,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    permitsion:{
        type: Boolean
    },
    plant:
    {
        type:Object
    }
});

var userData = mongoose.model('userData', userData, 'userData');

module.exports = userData;