const md5 = require('md5')
const fs = require('fs')
const http = require('http')
const path = require('path')
const deviceModel = require("../models/device")


module.exports.getDevice = async function(req , res) {
    var userId,id;
    try
    {
        userId = req.params.userId
        id = req.params.id
    }catch(err){
        res.send(err)
        return
    }

    var deviceList
    await deviceModel.findOne({
        userId: userId,
        id : id
    },function(err , data){
        if (err)
        { 
            res.send(err)
            return
        }
        deviceList = data
    })
    
    res.send(deviceList )

}


module.exports.getAllDevice = async function(req , res) {
    var userId,id;
    try
    {
        userId = req.params.userId
    }catch(err){
        res.send(err)
        return
    }

    var deviceList
    await deviceModel.find({
        userId: userId
    },function(err , data){
        if (err)
        { 
            res.send(err)
            return
        }
        deviceList = data
    })
    
    res.send(deviceList )

}

module.exports.addDevice = async function(req , res){
    try{
        var userId, mode, name
        
        name = req.body.name
        userId = req.body.userId
        data = req.body.mode
        status = req.body.status == "true"
        
        var deviceData = new deviceModel({
            userId : userId,
            name: name,
            mode : mode,
            unit : req.body.unit,
            data: req.body.data,
            id: req.body.id,
            status : status
        })

        await deviceData.save(function(err){
            if (err){
                res.send(err)
                return
            }
            res.send("success")
        })

    }catch(err){
        res.send(err)
    }
}

module.exports.updateMode = async function (req , res){
    try {
        var userId = req.params.userId;
        var id = req.body.id;
        var data = req.body.data;
        var name = req.body.name
        var unit = req.body.unit
        var status = req.body.status == "true"            
        var deviceQuerry = await deviceModel.findOne({
            id : id,
            userId: userId
        }
        , function(err , data){
            if (err){
                res.send(err)
                return
            }
            if (data == null) {
                res.send("Can't find device")
                return
            }
        })
        
        await deviceQuerry.updateOne(
        {
            $set: {
                id : id,
                data : data,
                name : name,
                unit : unit,
                status: status
            }
        }, function(err)
            {
                if(err)
                {
                    res.send(err)
                    return
                } 
                res.send(res.statuscode)
                return
            }
        )

    } catch (error) {
        res.send(error)        
    } 
}
