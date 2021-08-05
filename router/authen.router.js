const express = require('express');
const multer = require('multer')
var router = express.Router();
const sharp = require('sharp')
const fs = require('fs')
var path = require('path')

const controller = require('../controllers/authen.controller')
const validate = require('../validate/auth.validate')

const storage = multer.diskStorage({
    destination : function(req , file , cb){
        console.log(1)
        var direction = __dirname.replace('router' , '')
        cb(null , path.join(  direction + 'public/image/avatar/'))
    } , 
    filename : function(req , file , cb){
        // console.log(file)
        console.log(2)

        cb(null , file.originalname)
        console.log(5)

    }
    
}) 

const upload = multer({
    storage : storage,
    onError: function(err, next) {
    console.log(err);
    console.log(3)

      next(err);
    }
})

const resizeImage = async function(req, res , next){
    try{
    var direction = __dirname.replace('router' , '')
        console.log(4)
    console.log(req.file.path)
    const files = fs.readdirSync(path.join(  direction + 'public/image/avatar/'))

        for (const file of files) {
            console.log(file)
        }

    if (!req.file) {
        
        return next();
    }
    sharp.cache(false);
    console.log(path.join(direction + req.file.path))
    var pathName = path.extname(req.file.originalname)
    try{
        await sharp(req.file.path)
        .resize(50, 50)
        .png({quality:100})
        .toFile( path.join(direction + 'public/image/avatar/' + 'edited-' +req.file.originalname));
        fs.unlinkSync(req.file.path)
    }catch(e){
       
        next()
    }
        console.log(7  )
    
    
    next();
}
    catch(errr){
        next();
    }
}
 

router.get('/login', controller.login);
router.post('/login' ,validate.postLogin, controller.postLogin);

router.post('/signup' , upload.single('file'), resizeImage, controller.creatAcount)

router.get('/signOut', controller.signOut);

router.get('/get_user/:userId' , controller.get_user)

router.post('/signInUser' , validate.login , controller.loginUser )

router.post('/check_mail' , controller.checkMail)

router.post('/add_plant', controller.addPlant )

module.exports = router