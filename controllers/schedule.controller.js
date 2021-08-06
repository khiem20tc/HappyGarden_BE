const { shuffle } = require("../db")
const scheduleModel = require("../models/schedule")
const event_update = require("../script/event").updateSchedule

module.exports.updateSchedule = async function(req, res)
{
    var schedule = req.body.schedule
    var userId = req.params.userId
    var data_find
    var queryset = await scheduleModel.findOne({
        userId : userId
    }, function(er, data){
        if(er)
        {
            res.send(er)
            return
        }
        data_find = data
        
    })

    // if (data_find == null)
    // {

    //     var schedule_schema = new scheduleModel({
    //         schedule : schedule,
    //         userId : userId
    //     })

    //     await schedule_schema.save(function(err){
    //         if(err){
    //             res.send(JSON.stringify(err))
    //             return
    //         }
    //         event_update.emit("update")
    //         res.send("success")
    //     })
    // } else
    // {
        queryset.updateOne(
            {
                $set:{
                    schedule:schedule
                }
            }, function(err){
            if (err){
                res.send(err)
                return
            }
            else res.send("success")
            event_update.emit("update")
            return
        })
    //}
}

module.exports.getSchedule = async function(req , res)
{

    var userId = req.params.userId
    var data_find
    // var queryset = await scheduleModel.findOne({
    //     userId : userId
    // }, function(er, data){
    //     if(er)
    //     {
    //         res.send(er)
    //         return
    //     }
    //     data_find = data
    // })
    var data_find = await scheduleModel.findOne({
            userId : userId
        })
    return res.json(data_find)
}