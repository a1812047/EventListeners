

 var Myapp = new Vue({
    el:'#app',
    data:{
        HomePage:true,

        Create:false,
        first :false,
        second :false,
        third: false,
        fourth: false,
        PreviousSidebarindex:"",
        Sidebarindex:"",

        EventName:"",
        EventDate:"",
        StartTime:"",
        EndTime:"",
        Description:"",
        checked:[],
        privateOrpublic:"",
        address :{city:"", Address1:"",state:"",country:"",postcode:""},
        selected: "Type of Event",
        numberOfattendees: "",


        FirstName:"My",
        LastName:"Profile",
        ProfileName:"ChangeUrProfileName",
        Email:"testing@gmail.com",
        myusername:"",
        
        newProfileName:'',
        createPageNavItems :[
        {name:'Basic Description', style: "darkgray"},{name:'Organiser Details', style:"transparent"},
        {name: 'Date & Time', style:"transparent"}, 
        {name:'Preview & Confirmation',style:"transparent"}
        ],
        
        ProfileSettings:false,
        Confirmation:false,
        ConfirmEmailMsg:false,
        Settings:false,
        EventsList:[//upcoming, invited, created
            true,
            false,
            false,
    ],
    eventPage:false,
    EventsListMsgs:["Going","Invited","Discover More Upcmoing events"],
        
        leftPartval: "Welcome to Event Listeners",
        EventGoingTo:[
            ],
        EventInvitedTo:[
            ],
        CreatedEvents:[
        ],
        eventDetails:{},
         guestlist:[],

    // eventDetails:{
    //         imageURL:"",
    //         EventName:"",
    //         EventDate:"",
    //         StartTime:"",
    //         EndTime:"",
    //         Description:"",
    //         is_it_Online:"",
    //         privateOrpublic:"",
    //         address :{city:"", Address1:"",state:"",country:"",postcode:""},
    //         typeofEvent: "",
    //         numberOfattendees: "",
    //         Organiser:"",
    // },
    
},
    methods:{
        //0 -> homepagge, 1 is Create, 2 is Create
        displayContent: function(value){
            var body=document.querySelector('body')
            this.Settings = false;
            this.ProfileSettings = false;
            this.eventPage = false;
            if(value == '0'){
                body.style.height = "200vh";
                this.HomePage = true;
                for(item of this.EventsList){
                    item = false;
                }
                this.Create = false;
                this.leftPartval = "Home"
                
            }else if(value == '1'){
                body.style.height = "100vh";
                this.HomePage = false;
                for(item of this.EventsList){
                    item = false;
                }
                this.Create = true;
                this.leftPartval = "Creating an Event";
            }else if (value >= '2'){
                body.style.height = "200vh";
                this.HomePage = false;
                var index = value-2;
                for(item of this.EventsList){
                    item = false;
                }
                this.EventsList[index] = true;
                this.Create = false;
                this.leftPartval = this.EventsListMsgs[index];

            }

            if (this.Create == true){
                this.first = true;
                this.second = this.third = this.fourth = false;
                
            }
            
        },
        displayMe: function(index){
            if(index == 0){
                this.first = true;
                this.second = false;
                this.third = false;
                this.fourth = false;
            }else if(index == 1){
                this.first = false;
                this.second = true;
                this.third = false;
                this.fourth = false;
            }else if(index == 2){
                this.first = false;
                this.second = false;
                this.third = true;
                this.fourth = false;
            }else if (index == 3){
                this.first = false;
                this.second = false;
                this.third = false;
                this.fourth = true;
                
            }
            this.changeColor(index);
            
            
        },
       changeColor: function(index){
        var elements = document.getElementById("EventCreationSteps").childNodes;
        elements[index].style.backgroundColor = "darkgray";
        for(let i = 0; i < elements.length; i++){
            
            if(i != index){
                elements[i].style.backgroundColor = "#8cd1cb";
            }
        }
       }, 
       setMinDate: function(){
           var date = new Date();
           let currentDate = date.getDate()+1;
           let currentMonth = date.getMonth()+1;
           if (currentDate < 10){
               currentDate = '0'+currentDate;
           }
           if(currentMonth < 10){
               currentMonth = '0'+currentMonth;
           }
           const currentYear = date.getFullYear();
           const calendar = document.getElementById("calendar");
           calendar.setAttribute('min',currentYear+"-"+currentMonth+"-"+currentDate);
       },
       
       OncreateEvent:function(){//takes in a callback function 
        var hp = new XMLHttpRequest();
        hp.open('post', '/dumpEvent_into_database', false);
        hp.setRequestHeader('Content-type', 'application/json');
        hp.send(JSON.stringify({
        username:Myapp.myusername,
        EventName:Myapp.EventName,
        Description:Myapp.Description,
        checked:Myapp.checked[0],
        privateOrpublic:Myapp.privateOrpublic,
        typeofEvent:Myapp.selected,
        ExpectednumberofHumans: Myapp.numberOfattendees,
        }));
        hp.onreadystatechange = storetimeNlocation(hp);
        //calls with the eventID;
       },
       
       

       goToProfileSettings: function(){
        this.HomePage = false;
        this.Discover = false;
        this.Create = false;
        this.eventPage = false;
          this.leftPartval = "Manage Profile"
           this.first = this.second = this.third = this.fourth = false;
            this.ProfileSettings = true;
            document.querySelector('body').style.height = "100vh";
             
       },

       goToSettings: function(){
        this.eventPage = false;
        this.HomePage = false;
        this.Discover = false;
        this.Create = false;
        this.ProfileSettings = false;
        this.Settings = true;
        this.leftPartval = "Settings"
        document.querySelector('body').style.height = "100vh";
        this.first = this.second = this.third = this.fourth = false;

       },
       goToeventPage:function(){
        
        this.HomePage = false;
        this.Discover = false;
        this.Create = false;
        this.ProfileSettings = false;
        this.Settings = false;
        this.first = this.second = this.third = this.fourth = false;
        this.leftPartval = this.eventDetails.EventName;
        document.querySelector('body').style.height = "200vh";
        this.eventPage = true;
       },

       logoutUser:function(){
           alert("logout successful");
           var xhttp = new XMLHttpRequest();
           xhttp.open('get','/users/logout',true);
           xhttp.send();
           window.location = 'login.html';
       },

       getInfo:function(){//stores all the information into Vue data properties above for 
           var xhttp = new XMLHttpRequest();//easy rendering of some data into the page.
           xhttp.open('get','/userInfo', true);
           xhttp.send();
           xhttp.onreadystatechange = function(){
               if(this.readyState == 4 && this.status == 200){
                
                var response = JSON.parse(this.responseText);
                console.log(response.length);
                console.log("this response looks like this: "+ this.responseText);
                Myapp.FirstName = response[0].first_name;
                Myapp.LastName  =response[0].last_name;
                Myapp.Email = response[0].emailID;
                Myapp.myusername = response[0].username;
                setTimeout(updateCreateList,500);
                setTimeout(updateInviteList,500);
                setTimeout(updateUpcomingList,500);
                setTimeout(get_num_going,500);
                setTimeout(get_user_going,500);
               } 
           }
       },

       editCreatedEvent:function(index){
        let eventID = this.CreatedEvents[index].eventID;
        var XML = new XMLHttpRequest();
        XML.open('get', '/getEvent?eventID='+eventID,true);
        
        
       
        XML.onreadystatechange = function(){
            if(this.readyState == 4){
                let response = (this.responseText);
                console.log(response);
                response = JSON.parse(response);
                console.log(response);
                let data = 
                {
                    imageURL: response.image_,
                    EventName : response.title,
                    EventDate : response.date_,
                    StartTime : response.start_time,
                    EndTime : response.end_time,
                    Description : response.Description,
                    is_it_Online : response.is_it_Online,
                    privateOrpublic : response.private_or_public,
                    typeofEvent : response.type_of_event,
                    numberOfattendees : response.Expected_humans,
                    Organiser : response.username,
                    
                    city : response.city,
                    Address1 : response.address1,
                    state : response.state_,
                    country : response.country,
                    postcode : response.postal_code,
                    eventID : eventID
                };
                    
            

                
                    
                    
                Myapp.eventDetails = data;
            
            }
            
        }
        XML.send();

        
       },
       deleteGuest: function(index){
            Myapp.guestlist.splice(index,1);
            var element = document.getElementById("inviteButton");
            if(this.guestlist.length == 0){
                element.disabled = true;
            }else{
                element.disabled = false;
            }
        },
        showEvent: function(index){
            //invitations

            let e = this.EventInvitedTo[index].eventID;
            let url = "http://localhost:3000/eventPage?emailID="+Myapp.Email+"&eventID="+e;
            window.open(url);
        }
    },
    computed:{
       
       
    }

 });


function shareLink(){
    var link = window.location.href;
    navigator.clipboard.writeText(link);
    alert('Copied link: '+ link);
}
function  storetimeNlocation(hp){
    let eventID = (JSON.parse(hp.responseText))[0];
   
    var x = new XMLHttpRequest();
    x.open('post','/dumptimeLocation',true);
    x.setRequestHeader('Content-type','application/json');
    x.send(JSON.stringify({
        eventID,
        address :Myapp.address,
        EventDate:Myapp.EventDate,
        StartTime:Myapp.StartTime,
        EndTime:Myapp.EndTime,
    }));
    x.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            alert("you will now be taken to the event page to add an image. GOOD LUCK!!");
        }
    }
    //this is just going to post the time and location info. 
};

var readURL = function (event){
    var image = document.createElement("img");
    image.src = URL.createObjectURL(event.target.files[0]);

    image.height = "200";
    document.getElementById("image_box").appendChild(image);
};
function focusWithYellow(x){
    x.style.backgroundColor = "yellow";
};
function changeBackColor(x){
    x.style.backgroundColor = "transparent"
}
function ProfileNameSaved(){
    Myapp.Confirmation = true;
    Myapp.ConfirmEmailMsg = false;
    var newName = document.getElementById("changeName");
    newName.style.display = "none";
    Myapp.ProfileName = Myapp.newProfileName;
}
function ProfileNameNotSaved(){
    var newName = document.getElementById("changeName");
    newName.style.display = "none";
    Myapp.ConfirmEmailMsg = false;
    Myapp.Confirmation = false;
}
function changeEmail(){
    var email = document.getElementById("emailDisp");
    
    email.innerHTML = '<div ><input id = "newEmail" class = "inputbox border" type = "email" value ='+ Myapp.Email +'>                  <u onclick = "saveEmail()">Save</u>    <u onclick = "NotsaveEmail()">Cancel</u></div>';
    
}
function saveEmail(){    
    Myapp.Email = document.getElementById('newEmail').value;
    document.getElementById("emailDisp").innerHTML = '<u>'+Myapp.Email+'</u>';
    Myapp.Confirmation=false;
    Myapp.ConfirmEmailMsg = true;
    var newXhttp = new XMLHttpRequest();
    newXhttp.open('get','/changeEmail?newEmail='+Myapp.Email+'&username='+Myapp.myusername,true);
    newXhttp.send();
}
function NotsaveEmail(){    
    Myapp.ConfirmEmailMsg = false;
    Myapp.Confirmation = false;
    document.getElementById("emailDisp").innerHTML = '<u>'+Myapp.Email+'</u>';
}


function updateCreateList(){
    var xrt = new XMLHttpRequest();
    xrt.open('GET','/updateCreateList?user='+Myapp.myusername,true);
    xrt.send();
    xrt.onreadystatechange= function(){
        if(this.readyState == 4 && this.status == 200){
            let response = JSON.parse(this.responseText);
            if(response.length > Myapp.CreatedEvents.length){
                for(let i = Myapp.CreatedEvents.length; i < response.length; i++){
                    let data = {
                        eventID :response[i].eventID,
                        imageURL : response[i].image_,
                        title : response[i].title,
                        Date : response[i].date_,
                        startTime : response[i].start_time,
                        Location : response[i].city+ ' ' +response[i].state_+' '+ response[i].country,
                        NumOfAttendees : response[i].Expected_Humans
                    }
                    Myapp.CreatedEvents.push(data);
                }
            }
            
        }
    }
}

function updateInviteList(){
    
    var xrt = new XMLHttpRequest();
    xrt.open('GET','/updateInviteList?user='+Myapp.Email,true);
    xrt.send();
    xrt.onreadystatechange= function(){
        if(this.readyState == 4 && this.status == 200){
            let response = JSON.parse(this.responseText);
            if(response.length > Myapp.EventInvitedTo.length){
                for(let i = Myapp.EventInvitedTo.length; i < response.length; i++){
                    let data = {
                        eventID :response[i].eventID,
                        imageURL : response[i].image_,
                        title : response[i].title,
                        Date : response[i].date_,
                        startTime : response[i].start_time,
                        Location : response[i].city+ ' ' +response[i].state_+' '+ response[i].country,
                        NumOfAttendees : response[i].Expected_Humans
                    }
                    Myapp.EventInvitedTo.push(data);
                }
            }else if(response.length< Myapp.EventInvitedTo.length){
                while(Myapp.EventInvitedTo.length != 0){
                    Myapp.EventInvitedTo.pop();
                }
            }
            
        }
    }
}

function updateUpcomingList(){
    while(Myapp.EventGoingTo.length != 0){
        Myapp.EventGoingTo.pop();
    }
    var xrt = new XMLHttpRequest();
    xrt.open('GET','/updateUpcomingList?user='+Myapp.Email,true);
    xrt.send();
    xrt.onreadystatechange= function(){
        if(this.readyState == 4 && this.status == 200){
            let response = JSON.parse(this.responseText);
            if(response.length > Myapp.EventGoingTo.length){
                for(let i = Myapp.EventGoingTo.length; i < response.length; i++){
                    let data = {
                        eventID :response[i].eventID,
                        imageURL : response[i].image_,
                        title : response[i].title,
                        Date : response[i].date_,
                        startTime : response[i].start_time,
                        Location : response[i].city+ ' ' +response[i].state_+' '+ response[i].country,
                        NumOfAttendees : response[i].Expected_Humans
                    }
                    Myapp.EventGoingTo.push(data);
                }
            }
            
        }
    }
}
function checkEmail(value){
    const pattern = /^[^\s@]+@([^\s@.]+\.)+[^\s@.]+$/g;
    if(!(pattern.test(value))){
        document.getElementById("errorDisp").innerText = "INVALID EMAIL";
        document.getElementById("addguest").disabled = true;
    }else{
        document.getElementById("addguest").disabled = false;
        document.getElementById("errorDisp").innerText = "";
    }
}

function checkBut(){
    var element = document.getElementById("inviteButton");
    if(Myapp.guestlist.length== 0){
        element.disabled = true;
    }else{
        element.disabled = false;
    }
}

function InviteGuests(){
    for(let i = 0; i < Myapp.guestlist.length; i++){
        InviteGuest(Myapp.guestlist[i]);
    }
};
function InviteGuest(value){
    var xhtp = new XMLHttpRequest();
    xhtp.open('post','/inviteGuest', true );
    xhtp.setRequestHeader('Content-type','application/json');
    xhtp.send(JSON.stringify({
        emailID: value,
        eventID: Myapp.eventDetails.eventID,
    }));

};


function AddGuest(){
    if(document.getElementById("errorDisp").innerText == "INVALID EMAIL"){
        document.getElementById("addguest").title = "rectify the issues below first";
    }else{
        document.getElementById("addguest").title = "click to add the guest list below.";
        Myapp.guestlist.push(document.getElementById("guestEmail").value);
        var element = document.getElementById("inviteButton");
        element.disabled = false;
        element.style.bac
        
    }

}
setInterval(get_num_going,10000);

function get_num_going() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
        var response_arr = JSON.parse(this.responseText);
        var num_going= response_arr[0].num_going;
        }
        document.getElementById("num_going").innerText = num_going;
    };
  
  xhttp.open("GET", "/get_num_going?eventID="+Myapp.eventDetails.eventID, true);
  xhttp.send();
  }
  
  
  function get_user_going() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
        var user_array = JSON.parse(this.responseText);
        var user_list = "";
        for (let i=0; i < user_array.length; i++){
            user_list = user_list +
            "<tr><td>" + user_array[i].emailID + "</td></tr>";
        }
        document.getElementById("user_going").innerHTML = user_list;
    }
  };
  
  xhttp.open("GET", "/get_user_going?eventID="+Myapp.eventDetails.eventID, true);
  xhttp.send();
  
  }
  

