var schedule = require("./fetchSchedule")
var update_schedule = require('./event').updateSchedule
var publishEvent = require('./event').publishEvent
var node_cron = require('node-cron')


module.exports.autoRespone = async function(
    userName , password , clientSubcribe, is_publish = false
){
    var mqtt = require('mqtt');
    var data_schedule
    await schedule.fetchSchedule().then(data =>{
        data_schedule = data
        console.log("update schedule") 
    })
    console.log(data_schedule)

    publishEvent.on("publish", (text, type = undefined)=>{
        if (is_publish == false) return
        else
        {
            client.publish("CSE_BBC1/feeds/bk-iot-relay" , JSON.stringify(text))
            console.log("publish",text , JSON.stringify(type))
        }
    })

    update_schedule.on("update", async ()=>{
        await schedule.fetchSchedule().then(data =>{
            data_schedule = data 
        })

    })
   
    const client = mqtt.connect('tcp://io.adafruit.com:1883', {
        username: userName,
        password: password,
    });

    client.on('connect', () => {
    client.subscribe(clientSubcribe)
    console.log("Connected ADAFRUIT...")
    })

    client.on("error" , function(error){
        console.log( clientSubcribe,error)
    })
    // var text = {"id": "11", "name": "RELAY", "data": `${true?0:1}`, "unit": ""}
    // publishEvent.emit("publish", text)
    // client.publish("CSE_BBC1/feeds/bk-iot-relay" , JSON.stringify({"id": "11", "name": "RELAY", "data": "0", "unit": ""}))

    var temp
    var light
    var soil 
    var client_topic
    client.on('message', function(topic, message, packet) {
    
        try {
            var mes_json = JSON.parse(message)
            if (mes_json.last_value == undefined){
                if (mes_json.name == "LIGHT")
                {
                    light = mes_json
                }
                else if (mes_json.name == "SOIL")
                {
                    soil = mes_json
                }
                else if (mes_json.name == "TEMP-HUMID")
                {
                    temp = mes_json
                }

                console.log(temp , light , soil)
                schedule.updateDevice(undefined , mes_json.id , undefined , mes_json.data)
            }

        }catch(err){
            // console.log(err)
        }

        if (topic.indexOf("/json") == -1 && topic.indexOf("/csv") == -1 && topic.indexOf('bk-iot') != -1){
            client_topic = topic
            console.log(client_topic)

        }

    });

    // var text = {"id": "11", "name": "RELAY", "data": `${true?1:0}`, "unit": ""} 
                            
                        // console.log(client_topic , JSON.stringify(text))
                        // client.publish("CSE_BBC1/feeds/bk-iot-relay" , JSON.stringify(text))
                        
    // publishEvent.emit("publish", text)
    // await schedule.updateLog("60d3e6d66cd58b00151a3e2d" , getDate() , JSON.stringify({"text":`system turn off the pump` , "time":getTime1()}))

    node_cron.schedule("0-59 * * * *", async ()=>{
        try{
        var currentTime  = getTime()
        var currentDate = getDate() 
        for (x of data_schedule)
            {
                if (typeof(x.schedule) == "string")    
                    x.schedule = JSON.parse(x.schedule)
                // console.log(x.schedule)
                var device
                await schedule.getDevice(x.userId, "11").then(e => {
                    device = e
                })
                
                for (i of x.schedule.data)
                {
                    if (i.status != true) continue
                   
                    if (i.ho != undefined && i.hof != undefined)
                    {
                
                        if (
                            Date.parse("01/01/2021 " +i.ho) >= Date.parse("01/01/2021 " +currentTime) || 
                            Date.parse("01/01/2021 " +i.hof) <= Date.parse("01/01/2021 " +currentTime)
                        )
                        {
                            try{
                                
                            
                            if (device.data == "1") {

                                publishEvent.emit("publish", {"id": "11", "name": "RELAY", "data": `${0}`, "unit": ""})
                        
                                // await schedule.updateDevice(x.userId, i.id , trigger, )
                                await schedule.updateLog(x.userId , currentDate, JSON.stringify({"text":`system turn off the pump` , "time":currentTime}))
                            }
                            continue
                        }catch(e){
                            continue
                        }
                        }
                    }
                    try{
                    
                    
                        var trigger
                        if (i.name == "LIGHT"){
                            trigger = validate(light , i)
                        } else if (i.name == "SOIL")
                        {
                            trigger = validate(soil , i)
                        }
                            
                        else if (i.name == "TEMP-HUMID") 
                            {
                                var a = temp.data.split("-")
                                var a1 = i.on.split("-")
                                var a2 = i.off.split("-")
                                var b = inRange(parseInt(a[0]), parseInt(a1[0]), parseInt(a2[0]))
                                var c = inRange(parseInt(a[1]), parseInt(a2[1]),  parseInt(a1[1]))
                                
                                trigger = b && c
                            }
                        
                       
                        
                        if ( parseInt(device.data) == (trigger?1:0)) continue
                        var text = {"id": "11", "name": "RELAY", "data": `${trigger?1:0}`, "unit": ""} 
                            
                        // console.log(client_topic , JSON.stringify(text))
                        // client.publish("CSE_BBC1/feeds/bk-iot-relay" , JSON.stringify(text))
                        
                        publishEvent.emit("publish", text, i)
                        // await schedule.updateDevice(x.userId, i.id , trigger)
                        await schedule.updateLog(x.userId , currentDate, {"text":`system turn ${trigger? "on":"off"} the pump`, "time":currentTime})
                    
                }
                catch(er){
                    // console.log(er)
                    continue
                }
                }    
            }
        }
        catch(er)
        {
            console.log(er)
        }
    },{
        scheduled: true,
        timezone: "Asia/Bangkok"
    })
    
}

function getTime()
{
    var date = new Date()
    var currentTime  = date.getHours() +":"+date.getMinutes() + ":" + date.getHours();
    return currentTime
}

function getTime1()
{
    var date = new Date()
    var currentTime  = date.getHours() +":"+date.getMinutes();
    return currentTime
}

function getDate()
{
    var date = new Date()
    var currentDate = date.getDate() +" "+ date.getMonth()+ " " + date.getFullYear();
    return currentDate
}

function validate(temp , i )
{
    return i.on <= parseInt(temp.data) &&
                            i.off >= parseInt(temp.data)
}

function inRange(value , rangeTop , rangerBot )
{
    var max = Math.max(rangerBot , rangeTop),
        min = Math.min(rangeTop, rangerBot)
    return value >= min && value <= max
}