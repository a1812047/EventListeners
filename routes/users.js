var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
const argon2 = require('argon2');




router.post('/authLogin', function(req,res,next){
 
  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }
    let username = req.body.username;
    let password = req.body.password;
    let query = "SELECT * FROM users where username = ? and password = ?;";
    
    connection.query(query,[username, password], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      console.log(rows);
      console.log(req.session);
      req.session.user = username;
      console.log(req.session);
      res.json(rows);
    });
  });
});

router.get('/emailCheck',function(req,res,next){
  if(!('user' in req.session)){
    return res.redirect('/login');
  }
  next();
});
router.get('/emailCheck', function(req, res, next){
  let value = req.query.param1;
  
  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }

    let query = "SELECT * FROM users WHERE emailID =?;";
    connection.query(query,[value], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
});
});
router.use('/userCheck',function(req,res,next){
  if(!('user' in req.session)){
    return res.redirect('/login');
  }
  next();
});
router.get('/userCheck', function(req, res, next){
  let value = req.query.param1;
  
  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }

    let query = "SELECT username FROM users WHERE username =?;";
    connection.query(query,[value], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
});
});

router.use('/userdata',function(req,res,next){
  if(!('user' in req.session)){
    return res.redirect('/login');
  }
  next();
});
router.post('/userdata', function(req, res, next){
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  var emailID = req.body.emailID;
  let username=req.body.username;
  let password = req.body.password;
  
  // var phash = null;
  // try {
  //   phash = await argon2.hash(password);
  // } catch (err) {
  //   res.sendStatus(500);
  //   return;
  // }
  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }

    let query = "INSERT INTO users Values(?,?,?,?,?,0,CURRENT_TIME)";
    connection.query(query,[firstName,lastName,emailID,password,username], function(error, rows, fields) {
      connection.release(); // release connection
      req.session.user = username;//user in the session
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      console.log(JSON.stringify(rows));
      //send an email to the emailID;
      
     res.end();
    });
});

});

router.get('/logout',function(req,res,next){
  console.log(req.session);
  if('user' in req.session){
    delete req.session.user;
  }
  console.log(req.session);
  res.end();
});






module.exports = router;
