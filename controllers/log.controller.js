const md5 = require('md5')
const fs = require('fs')
const http = require('http')
const path = require('path')

const logModel = require("../models/log")



module.exports.getLog = async function(req , res){
    var userId, date , logData;
    try {
        userId = req.body.userId;
        // date = req.body.date;
    }catch(err){
        res.send("error")
        return
    }
    console.log("getLog body" , req.body)
    await logModel.findOne({
        userId : userId
    }, function(err , data){
        if (err){
            res.send(err)
            return
        }
        logData = data;
    })

    res.send({
        status: "success",
        data: logData
    })

}


module.exports.creatLog = async function(req , res){
    var userId, date, data, log
    try {
        userId = req.body.userId
        date = req.body.date
        data = req.body.data
    } catch (err) {
        res.send(err);
        return
    }
    console.log("userid" , req.body)
    var logQuerry = await logModel.findOne({
        userId : userId
    } , function (err , data){
        if (err){
            res.send(err)
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
            if (err){
                res.send(err)
                return
            }
            else res.send('success')
            return
        })
    } 
    else 
    {
        let object = {}
        object[date] = data
        log.history.push(object);
        console.log(log)
        await logQuerry.updateOne({
            $set: {
                history : log.history
            }
        }, function(err){
            if (err){
                res.send(err)
                return
            }
            else res.send("success")
            return
        })
    }
}