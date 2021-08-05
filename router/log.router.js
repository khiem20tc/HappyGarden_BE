const express = require('express');
const multer = require('multer')
var router = express.Router();
const sharp = require('sharp')
const fs = require('fs')
var path = require('path')

const logController = require("../controllers/log.controller")


router.post('/creat' , logController.creatLog);

router.post("/get"  , logController.getLog)

module.exports = router