const scheduleModel = require('../models/schedule')
const logModel = require("../models/log")
const deviceModel = require("../models/device")
module.exports.fetchSchedule = async function()
{
    var result
    await scheduleModel.find({__v:0} ,function(er,data){
        if(er){
            result = null
            return
        }
        result = data
    })
    // console.log(result[0].schedule)
    return result  
}

module.exports.updateLog = async function(userId, date, status)
{
    var userId, date, data, log
    try {
        userId = userId
        date = date
        data = status
    } catch (err) {
       
        return
    }
  
    var logQuerry = await logModel.findOne({
        userId : userId
    } , function (err , data){
        if (err){
            
            return
        }
        log = data
    })

    if (log == null){
        let object = {}
        object[date] = data

        log = new logModel({
            userId : userId,
            history : [
                object
            ]
        })
        await log.save(function(err){
            return
        })
    } 
    else 
    {
        let object = {}
        object[date] = data
        log.history.push(object);
        // console.log(log)
        await logQuerry.updateOne({
            $set: {
                history : log.history
            }
        }, function(err){
           
            return
        })
    }
}

module.exports.updateDevice = async function(
    userId = undefined , id , status = undefined, data = undefined 
    )
{
    try {
        
        var payload = {} , filter = {}
        if (data != undefined)
            payload["data"] = data
        if (status != undefined)
            payload["status"] = status
        filter["id"] = id
        if (userId != undefined)
            payload[userId] = userId
        var deviceQuerry = await deviceModel.updateMany(
            filter,
        {
            $set: payload
        }
        , function(err , result){
            if (err){
                console.log(err)
                return undefined
            }
            if (result == null) {
                return undefined
            }
        })
        

    } catch (error) {
        console.log(error)
        return undefined        
    } 
}

module.exports.getDevice = async function(userId, id)
{

    var deviceList = await deviceModel.findOne({
        userId: userId,
        id : id
    },function(err , data){
        if (err)
        { 
            console.log(err)
            return []
        }
        // console.log(data)
        deviceList = data
        
    })
    return deviceList
    
}


