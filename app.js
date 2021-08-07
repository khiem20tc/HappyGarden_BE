const express = require('express');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const path = require('path')
var logger = require('morgan');
var createError = require('http-errors');

require('dotenv').config();


const authRouter = require('./router/authen.router')
const logRouter = require('./router/log.router')
const validateAuth = require('./validate/auth.validate')
const deviceRouter = require('./router/device.router')
const scheduleRouter = require('./router/schedule.router')

const sessionMiddleware = require('./middleware/session.middleware')
const autoRespone = require("./script/mqtt.server")

mongoose.connect(process.env.MONGO_URL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    serverSelectionTimeoutMS: 5000
}).catch(err => console.log(err)); 
mongoose.set('useFindAndModify', false);

const app = express();

app.set('view engine', 'pug'); 
app.set('views', './views');

app.use(cookieParser('process.env.SESSION_SECRET'));
app.use(sessionMiddleware)

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,  X-Auth-Token');
  next();
});



app.use('/auth' , authRouter)
app.use('/log' , logRouter)
app.use('/device',deviceRouter)
app.use('/schedule', scheduleRouter)

autoRespone.autoRespone(process.env.USER_NAME1, process.env.PASSWORD1 , process.env.SUBCRIBE1, true); //lock publish BBC
autoRespone.autoRespone(process.env.USER_NAME2, process.env.PASSWORD2 , process.env.SUBCRIBE2, true);


app.use(function(req, res, next){
  next(createError(404));
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;