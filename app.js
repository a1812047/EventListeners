var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var bodyParser = require('body-parser');
const multer = require('multer');
var mysql = require('mysql');
var dbConnectionPool = mysql.createPool({ host: 'localhost',user:'root',password:'Management123', database: 'EventListeners'});
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client("485231341035-2m7ghbg9kdptjtokvp2mccd2s79gnm3c.apps.googleusercontent.com");
// async function verify() {
//   const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: "485231341035-2m7ghbg9kdptjtokvp2mccd2s79gnm3c.apps.googleusercontent.com" // Specify the CLIENT_ID of the app that accesses the backend
//       // Or, if multiple clients access the backend:
//       //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
//   });
//   const payload = ticket.getPayload();
//   const userid = payload['sub'];
//   // If request specified a G Suite domain:
//   // const domain = payload['hd'];
//   console.log(userid);
// }
//verify().catch(console.error);
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const req = require('express/lib/request');

var app = express();


  
/*------------------------------------------
--------------------------------------------
image upload code using multer
--------------------------------------------
--------------------------------------------*/



app.use(session({
  secret: "hflasdfkahlsdfkhasdlfksajdhfaskh",
  resave:false,
  saveUninitialized:true,
  cookie:{
    secure:false,
  }
}));
app.get('/login',function(req,res,next){
  
  res.redirect('/login.html');
});
app.get('/',function(req,res,next){
  if(!('user' in req.session)){
    return res.redirect('/login');
  }
  next();
});
app.get('/index.html',function(req,res,next){
  if(!('user' in req.session)){
    return res.redirect('/login');
  }
  next();
});

app.use('/manageevent.html',function(req,res,next){
  if(!('user' in req.session)){
    return res.redirect('/login');
  }
  next();
});


app.get('/manageusers.html',function(req,res,next){
  if(!('user' in req.session)){
    return res.redirect('/login');
  }
  next();
});

app.use(function(req,res,next){
  req.pool = dbConnectionPool;
  next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
