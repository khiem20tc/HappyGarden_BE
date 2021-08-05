var mongoose = require('mongoose');

var data = new mongoose.Schema({
    userId: { 
        type: String, 
        require: true   
    },
    id: {
        type: String, 
        require: true 
    },
    mode:{
        type: Object,
        require: true,
    },
    name:{
        type: String,
        require:true
    },
    unit:{
        type: String,
        require:true
    },
    data:{
        type: String,
        require:true
    },
    status:
    {
        type: Boolean,
        require: true
    }
});

var deviceData = mongoose.model('deviceData', data, 'deviceData');

module.exports = deviceData;