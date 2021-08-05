const express = require('express');
const multer = require('multer')
var router = express.Router();
const sharp = require('sharp')
const fs = require('fs')
var path = require('path')

const deviceController = require("../controllers/device.controller")


router.post('/add' , deviceController.addDevice);

router.get("/get/:userId/:id"  , deviceController.getDevice)

router.get("/get/:userId"  , deviceController.getAllDevice)


router.post("/updateMode/:userId" , deviceController.updateMode)

module.exports = router