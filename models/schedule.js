var mongoose = require('mongoose');

var data = new mongoose.Schema({
    userId: { 
        type: String, 
        require: true   
    },
    schedule: {
        type: Object, 
        require: true 
    }
});

var scheduleData = mongoose.model('schedule', data, 'schedule');

module.exports = scheduleData;