const { toNumber } = require('@vue/shared');
var express = require('express');
const res = require('express/lib/response');
var router = express.Router();
var jwt = require('jsonwebtoken');
const multer = require('multer');

const { TIMESTAMP } = require('mysql/lib/protocol/constants/types');
var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'kennedy.ondricka27@ethereal.email',
      pass: 'Fb4gRK31fjMRQ6KNpD'
  }
});
// router.get(function(req,res,next){
//   if(req.body.user){
//     next();
//   }
//   return res.redirect('/login.html');
// });

const upload = multer({ dest: './public/uploads/' })
router.post('/uploadImage',upload.single('image'), function(req,res,next){
  var imgSrc = 'http://localhost:3000/uploads/'+req.file.filename;
  var q = req.session.eventID;
  console.log("this is my q "+ q);
  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }
  
    
    let query = "UPDATE images SET image_ = ?  where eventID = ?";
    console.log(imgSrc);
    connection.query(query,[imgSrc,q], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      //console.log(rows);
      res.redirect('/index.html');
    });
  });

});

router.post('/googleUser', function(req,res,next){
  console.log('this might be called first time');
  var googleUser = req.body.credential;
  var profile = jwt.decode(googleUser);
  
  req.session.user = profile.email;
  req.session.profile = profile;
  next();
});//the google user logs in.
//we get the credentials.
//now we need to check if any email matches any profile in the database.

router.post('/googleUser', function(req,res,next){
  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }
    let email = req.session.user;
    
    let query = "SELECT first_name,last_name,emailID,username FROM users where emailID = ?";
    
    connection.query(query,[email], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      //if there is no matching profile,we simply call next to create one.
      if(rows.length == 0){
        next();
      }else{//link the users session to their username
        console.log('this is red')
        req.session.user = rows[0].username;
        res.redirect('/index.html');
      }
      
    });
  });
});

//incase we do not get a matching profile.
router.post('/googleUser', function(req,res,next){
  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }
    let username = req.session.profile.email;
    let emailID = req.session.profile.email;
    let password = req.session.profile.sub;
    let firstname = req.session.profile.given_name;
    let lastname = req.session.profile.family_name;
    
    let query = "INSERT INTO users Values(?,?,?,?,?,1,CURRENT_TIME)";
    
    connection.query(query,[firstname,lastname,emailID,password,username], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      //console.log(rows);
      console.log('this is green !')
      res.redirect('/index.html');
    });
  });
});
router.use('/userInfo',function(req,res,next){
  if(!('user' in req.session)){
    return res.redirect('/login');
  }
  next();
});
router.get('/userInfo', function(req,res,next){
  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }
    let username = req.session.user;
    
    let query = "SELECT first_name,last_name,emailID,username FROM users where username = ?";
    
    connection.query(query,[username], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      //console.log(rows);
      res.json(rows);
    });
  });
});
router.use('/changeEmail',function(req,res,next){
  if(!('user' in req.session)){
    return res.redirect('/login');
  }
  next();
});
router.get('/changeEmail', function(req,res,next){
  

  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }
    let username = req.session.user;
    let newEmail = req.query.newEmail;
    console.log(newEmail+' '+username);
    let query = "UPDATE users SET emailID = ? where username = ?";
    
    connection.query(query,[newEmail,username], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      //console.log(rows);
      res.json(rows);
    });
  });
});

router.use('/sometest',function(req,res,next){
  if(!('user' in req.session)){
    return res.redirect('/login');
  }
  next();
});
router.get('/sometest',function(req,res,next){
  console.log(req.session);
  res.send('it works');
});

router.post('/dumpEvent_into_database',function(req,res,next){
  let username = req.body.username;
  let EventName = req.body.EventName;
  let Description = req.body.Description;
  let is_it_Online = req.body.checked;
  let privateOrpublic = req.body.privateOrpublic;
  let typeofEvent = req.body.typeofEvent;
  let Humans = req.body.ExpectednumberofHumans;
  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }
   
    let query = "INSERT INTO events (username,title, Description_,is_it_Online, private_or_public,type_of_event,Expected_humans,time_of_creation) VALUES(?,?,?,?,?,?,?,CURRENT_TIME);";
    
    connection.query(query,[username,EventName,Description,is_it_Online,privateOrpublic,typeofEvent,Humans], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      //console.log(rows);
      next();
    });
  });
});

router.post('/dumpEvent_into_database',function(req,res,next){
  let username = req.body.username;
  let EventName = req.body.EventName;
  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }
   
    let query = "SELECT eventID from events where title = ? and username = ? ORDER BY time_of_creation DESC";
    
    connection.query(query,[EventName,username], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      //console.log(rows);
      res.send(rows);
    });
  });
});

router.post('/dumptimeLocation',function(req,res,next){
  let eventID = req.body.eventID.eventID;
  let address = req.body.address;
  let Address1 = address.Address1;
  let city = address.city;
  let state = address.state;
  let country = address.country;
  let postcode = address.postcode;

  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }
   
    let query = "INSERT INTO locations(eventID,address1,city,state_,country,postal_code) Values(?,?,?,?,?,?)";
    
    connection.query(query,[eventID,Address1,city,state,country,postcode], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      //console.log(rows);
      next();
    });
  });
});

router.post('/dumptimeLocation',function(req,res,next){
  let info = req.body;
  console.log("another check\n");
  console.log(req.body.eventID.eventID);
  let eventID = info.eventID.eventID;
  let date = info.EventDate;
  let startTime = info.StartTime;
  let endTime = info.EndTime;
  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }
   
    let query = "INSERT INTO eventTime VALUES(?,?,?,?)";
    
    connection.query(query,[eventID,date,startTime,endTime], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      //console.log(rows);
      next();
    });
  });
});


router.post('/dumptimeLocation',function(req,res,next){
  let eventID = Number(req.body.eventID.eventID);
  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }
   
    let query = "INSERT INTO images (eventID) VALUES(?) ";
    
    connection.query(query,[eventID], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      //console.log(rows);
      res.end();
    });
  });
});

router.get('/eventpage',function(req,res,next){
  let q = Number(req.query.eventID);
  req.session.eventID = q;
  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }
   
    let query = "SELECT * FROM events INNER JOIN eventTime ON events.eventID = eventTime.eventID INNER JOIN locations ON locations.eventID = events.eventID INNER JOIN images ON events.eventID=images.eventID where events.eventID = ?;";
    
    connection.query(query,[q], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      console.log(rows);
      var eventDetails = rows[0];
      
      if(!('user' in req.session)){
        
        res.send(`<!DOCTYPE html>
        <html lang = "en">
        
        <head>
            <meta charset="utf-8">
            <link rel="stylesheet" href="stylesheets/mainpage.css">
            <link rel="stylesheet" href="stylesheets/style.css">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Event Listeners</title>
            <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Raleway" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Sofia&effect=fire" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Titillium+Web" rel="stylesheet">
            
            <script src="https://kit.fontawesome.com/d0e8f615cc.js" crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
            <script>
              function Accept(){
                var xhp = new XMLHttpRequest();
                let string = new URL(window.location.href);
              
                let searchParams = new URLSearchParams(string.search);
                let eventID = searchParams.get('eventID');
                let emailID = searchParams.get('emailID');

                xhp.open('post','/updateAvailableList',true);
                xhp.setRequestHeader('Content-type','application/json');
                xhp.send(JSON.stringify({
                  emailID:emailID,
                  eventID:Number(eventID)
                }));
                let B = document.getElementById("accept");
                B.style.backgroundColor = 'green';
                B.style.color = 'white';
                B.innerText = 'Accepted';
                
              }
              function shareLink(){
                var link = window.location.href;
                navigator.clipboard.writeText(link);
                alert('Copied link: '+ link);
              }
              function redirectHome(){
                window.location='/login.html'
              }
            </script>
        </head>
        
        <body style="height: 100vh;">
            <div id="app">
                <div class="navbar">
                    <p class="active" onclick = "redirectHome()"><i class="fas fa-home"></i>&nbsp;EventListeners</p>  
                    
                    <div class="dropdown">
                        <button  class="dropbutton" onclick = "redirectHome()"><i class="fas fa-user"></i>&nbsp;Login&nbsp;</button>
                    </div>
                </div> 
                <div >
                    
                        <div class="eventDiv">
                            
                          <div style="flex-direction: column; width: 45%;">
                            <h3 style="font-size:2.2vw;">Event Details</h3>
                            <p><i class="fas fa-calendar-alt"></i>&nbsp;&nbsp;&nbsp;${eventDetails.date_}</p>
                            <p>Starts at: ${eventDetails.start_time}  Ends at: ${eventDetails.end_time}</p>
                            <p><i class="fas fa-map-marker-alt"></i>&nbsp;&nbsp;&nbsp;${eventDetails.address1}</p>
                            <p>${eventDetails.city}, ${eventDetails.state_}, ${eventDetails.country},${eventDetails.postal_code}</p>
                            <p><i class="fas fa-question-circle"></i>&nbsp;&nbsp;&nbsp;${eventDetails.is_it_Online} ${eventDetails.type_of_event}</p>
                            <p><i class="fas fa-check-circle"></i>&nbsp;&nbsp;&nbsp;${eventDetails.Expected_humans} People expected</p>
                            <button  id = "accept" class="eventpagebutton" onclick="Accept()">ACCEPT</button>
                          </div>
                            
                                <img class="eventImage right" src="${eventDetails.image_}" alt="event image" style="width:50%; height:50%;margin-left:2rem">  
                        </div>
                    
                        
                    <div >
                            <p style="font-size:2.1vw;">Event Name: ${eventDetails.title}             <button class="eventpagebutton" onclick="shareLink()">Copy EVENTS Link</button>   </p>
                            <p style="font-size:1.3vw;">Organised by: ${eventDetails.username}</p>
                            <div style="border:solid;word-wrap:break-word;padding:2rem;">
                                <p style="font-size:1.5vw;">About the event: </p>
                                <p style="font-size:1.4vw;">${eventDetails.Description_}</p>
                        </div>

                    </div>
                </div>
            </div>
        </body>
        </html>`);
      }else{
        res.send(`<!DOCTYPE html>
        <html lang = "en">
        
        <head>
            <meta charset="utf-8">
            <link rel="stylesheet" href="stylesheets/mainpage.css">
            <link rel="stylesheet" href="stylesheets/style.css">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Event Listeners</title>
            <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Raleway" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Sofia&effect=fire" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Titillium+Web" rel="stylesheet">
            
            <script src="https://kit.fontawesome.com/d0e8f615cc.js" crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
            <script>
            function Accept(){
              var xhp = new XMLHttpRequest();
              let string = new URL(window.location.href);
              
              let searchParams = new URLSearchParams(string.search);
              let eventID = searchParams.get('eventID');
              let emailID = searchParams.get('emailID');
              xhp.open('post','/updateAvailableList',true);
              xhp.setRequestHeader('Content-type','application/json');
              xhp.send(JSON.stringify({
                emailID:emailID,
                eventID:Number(eventID)
              }));

              let B = document.getElementById("accept");
                B.style.backgroundColor = 'green';
                B.style.color = 'white';
                B.innerText = 'Accepted';
            }
              function shareLink(){
                var link = window.location.href;
                navigator.clipboard.writeText(link);
                alert('Copied link: '+ link);
              }
              function redirectHome(){
                window.location='/index.html'
              }
            </script>
        </head>
        
        <body style="height: 100vh;">
            <div id="app">
                <div class="navbar">
                    <p class="active" onclick = "redirectHome()"><i class="fas fa-home"></i>&nbsp; HOME</p>
                </div> 
                <div >
                    
                        <div class="eventDiv">
                            
                                <div style="flex-direction: column; width: 45%;">
                                    <h3 style="font-size:2.2vw;">Event Details</h3>
                                    <p><i class="fas fa-calendar-alt"></i>&nbsp;&nbsp;&nbsp;${eventDetails.date_}</p>
                                    <p>Starts at: ${eventDetails.start_time}  Ends at: ${eventDetails.end_time}</p>
                                    <p><i class="fas fa-map-marker-alt"></i>&nbsp;&nbsp;&nbsp;${eventDetails.address1}</p>
                                    <p>${eventDetails.city}, ${eventDetails.state_}, ${eventDetails.country},${eventDetails.postal_code}</p>
                                    <p><i class="fas fa-question-circle"></i>&nbsp;&nbsp;&nbsp;${eventDetails.is_it_Online} ${eventDetails.type_of_event}</p>
                                    <p><i class="fas fa-check-circle"></i>&nbsp;&nbsp;&nbsp;${eventDetails.Expected_humans} People expected</p>
                                    <button  id = "accept" class="eventpagebutton" onclick="Accept()">ACCEPT</button>
                                </div>
                            
                                <img class="eventImage right" src="${eventDetails.image_}" alt="event image" style="width:50%; height:50%;margin-left:2rem">  
                        </div>
                    
                        
                    <div >
                            <p style="font-size:2.1vw;">Event Name: ${eventDetails.title}             <button class="eventpagebutton" onclick="shareLink()">Copy EVENTS Link</button>   </p>
                            <p style="font-size:1.3vw;">Organised by: ${eventDetails.username}</p>
                            <div style="border:solid;word-wrap:break-word;padding:2rem;">
                                <p style="font-size:1.5vw;">About the event: </p>
                                <p style="font-size:1.4vw;">${eventDetails.Description_}</p>
                        </div>

                    </div>
                </div>
            </div>
        </body>
        </html>`);
      }
      
    });
  });
});


router.post('/updateAvailableList', function(req,res,next){
  let emailID = req.body.emailID;
  let eventID = req.body.eventID;
  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }
   
    let query = "INSERT INTO available VALUES(?,?);";
    connection.query(query,[emailID,eventID], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      //console.log(rows);
      next();
    });
  });
})
router.post('/updateAvailableList', function(req,res,next){
  let emailID = req.body.emailID;
  let eventID = req.body.eventID;
  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }
   
    let query = "DELETE FROM invite where emailID = ? and eventID =?;";
    connection.query(query,[emailID,eventID], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      //console.log(rows);
      res.end();
    });
  });
})
router.get('/updateUpcomingList', function(req,res,next){
  let emailID = req.query.user;
  
  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }
   
    let query = "SELECT DISTINCT * FROM events INNER JOIN eventTime ON events.eventID = eventTime.eventID INNER JOIN locations ON locations.eventID = events.eventID INNER JOIN images ON events.eventID=images.eventID INNER JOIN available ON available.eventID = events.eventID where available.emailID = ?;";
    connection.query(query,[emailID], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      
      res.json(rows);
    });
  });
})
router.get('/getEvent', function(req,res,next){
  let q = req.query.eventID;
  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }
   
    let query = "SELECT * FROM events INNER JOIN eventTime ON events.eventID = eventTime.eventID INNER JOIN locations ON locations.eventID = events.eventID INNER JOIN images ON events.eventID=images.eventID where events.eventID = ?;";
    
    connection.query(query,[q], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
     
      res.send(JSON.stringify(rows[0]));
    });
  });
})

router.get('/updateCreateList', function(req,res,next){
  let q = req.query.user;
  if(q == ""){
    q= req.session.user;
  }
  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }
   
    let query = "SELECT events.eventID, image_, title, date_,start_time,city, state_, country,Expected_Humans FROM events "+
                "NATURAL JOIN eventTime NATURAL JOIN locations NATURAL JOIN images where username = ? ORDER BY time_of_creation";
    
    connection.query(query,[q], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      //console.log(rows);
      res.json(rows);
    });
  });
});

router.get('/updateInviteList', function(req,res,next){
  let q = req.query.user;
  if(q == ""){
    q= req.session.user;
  }
  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }
   
    let query = "SELECT DISTINCT events.eventID, image_, title, date_,start_time,city, state_, country,Expected_Humans FROM events NATURAL JOIN eventTime NATURAL JOIN locations NATURAL JOIN images NATURAL JOIN invite where invite.emailID = ? ORDER BY events.eventID";
    
    connection.query(query,[q], function(error, rows, fields) {
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

router.get('/get_num_going', function(req, res, next) {
  req.pool.getConnection( function(error, connection) {
    if (error) {
      res.sendStatus(500);
      return;
    }
    var eventID = req.body.eventID;
    var query = "SELECT COUNT(DISTINCT emailID) AS num_going FROM available WHERE eventID = ?;";
    connection.query(query, [eventID], function(error, rows, fields) {
      connection.release();
      if (error) {
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});
router.get('/get_user_going', function(req, res, next) {
  req.pool.getConnection( function(error, connection) {
    if (error) {
      res.sendStatus(500);
      return;
    }
    var eventID = req.body.eventID;
    var query = "SELECT DISTINCT emailID FROM available WHERE eventID = ?;";
    connection.query(query, function(error, rows, fields) {
      connection.release();
      if (error) {
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});
router.post('/inviteGuest', function(req,res,next){
  var temp = req.body.emailID;
  let eventID = req.body.eventID;
  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }
   
    let query = "INSERT INTO invite VALUES(?,?)";
    
    connection.query(query,[temp,eventID], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }

      //send an email to the respective guests
      let url = "http://localhost:3000/eventPage?eventID="+eventID+"&emailID="+temp;
      let mailOptions={
        
        from:'kennedy.ondricka27@ethereal.email',
        to:temp,
        subject:"Welcome to EVent Listeners",
        html:`<p>You have been invited to the event: <a href=${url}>EventListeners
        </a></p>`,
      };
      transporter.sendMail(mailOptions,function(err, info){
        if(err){
          console.log(err);
        }else{
          console.log(info);
        }
      });
      res.end()
    });
  });
  
} )
module.exports = router;








