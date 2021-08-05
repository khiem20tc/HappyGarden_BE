var mongoose = require('mongoose');

var data = new mongoose.Schema({
    userId: { 
        type: String, 
        require: true   
    },
    history: {
        type: Object, 
        require: true 
    }
});

var userLog = mongoose.model('userLog', data, 'userLog');

module.exports = userLog;