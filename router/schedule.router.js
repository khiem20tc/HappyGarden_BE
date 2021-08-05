const express = require('express');
const multer = require('multer')
var router = express.Router();
const sharp = require('sharp')
const fs = require('fs')
var path = require('path')

const controller = require('../controllers/schedule.controller')

router.post("/:userId", controller.updateSchedule)
router.get("/:userId", controller.getSchedule)

module.exports = router