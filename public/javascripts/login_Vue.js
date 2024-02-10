



var MyLogin = new Vue({
    el: "#main",
    data: {
        firstName:"",
        lastName:"",
        emailAddress:"",
        Username:"",
        Password:"",
        alert_msg:"",
        email_msg:"",
        Username_check:false,
        emailAddress_check:false,

        login:{
            username:"",
            password:"",
            errormsg:"",
            errormsg2:"",
        }
        
    },
    methods:{

        authUser:function(){
            const pattern = /[\s]/g;
            if(pattern.test(this.login.username)){
                this.login.errormsg = "cannot have spaces!!";
            }else if(this.login.username.length == 0 || this.login.password.length == 0){
                this.login.errormsg2 = "Cannot leave blank input fields";
            }else{
                var xhttps = new XMLHttpRequest();
                xhttps.open('POST',"/users/authLogin",true);
                xhttps.setRequestHeader('Content-type', 'application/json');
                xhttps.send(JSON.stringify({username:MyLogin.login.username, password:MyLogin.login.password})); 
                
                    console.log("this is response"+ xhttps.responseText);//MyLogin is a Vue object;
                    var x = JSON.parse(xhttps.responseText);

                    if( x.length == 0){
                        MyLogin.login.errormsg2 = "Unauthorised login";
                        MyLogin.login.errormsg = "Username and password do not match";
                    }else{
                        window.location = '/index.html';
                    }
                window.location = '/index.html';
                // if(xhttps.status == 403){
                //     MyLogin.login.errormsg2 = "Unauthorised login";
                //     MyLogin.login.errormsg = "Username and password do not match";
                // }
            }
        },
        
        checkemail: function(){
            const pattern = /^[^\s@]+@([^\s@.]+\.)+[^\s@.]+$/g;
            if(!(pattern.test(MyLogin.emailAddress))){
                this.email_msg = "Invalid email";
                this.emailAddress_check = false;
            }else{
                this.email_msg = "";
                this.emailAddress_check = true;
                email_msg = "";
                var xhttp = new XMLHttpRequest();
                var url = "/users/emailCheck?param1="+MyLogin.emailAddress;
                xhttp.open('GET', url, false);
                xhttp.send();
                xhttp.onreadystatechange = function(){
                if(this.status == 200 && this.readyState == 4){
                    
                    
                    console.log(this.responseText);
                    if(this.responseText[0].length == 0){
                        MyLogin.email_msg = "";
                        MyLogin.emailAddress_check = true;
                    }else{
                        MyLogin.email_msg ="Email is already registered.";
                        MyLogin.emailAddress_check = false;
                    }
                }
            }
            }
            
        },
        checkusername: function(){
            const pattern = /[\s]/g;
            if(pattern.test(this.Username)){
                this.Username_check = false;
                this.alert_msg = "Cannot have spaces!!"
            }else{
                this.alert_msg = "";
                this.Username_check = true;
                var xhttp = new XMLHttpRequest();
                var url = "/users/userCheck?param1="+MyLogin.Username;
                xhttp.open('GET', url, true);
                xhttp.send();
                xhttp.onreadystatechange = function(){
                    if(this.status == 200 && this.readyState == 4){
                        var response = JSON.parse(xhttp.responseText);
                        
                        if(response.length == 0){
                            MyLogin.alert_msg = "";
                            MyLogin.Username_check = true;
                        }else{
                            MyLogin.alert_msg ="Choose a different username";
                            MyLogin.Username_check= false;
                        }
                    }
                }
            }
            
        },
        
        storeUserData: function(){
            if(this.Username_check==true && MyLogin.emailAddress_check == true){
                var xhtp = new XMLHttpRequest();
                xhtp.open('POST',"/users/userdata", true);
                xhtp.setRequestHeader('Content-type','application/json');
                xhtp.send(JSON.stringify({
                    firstName: MyLogin.firstName,
                    lastName:MyLogin.lastName,
                    emailID: MyLogin.emailAddress,
                    username: MyLogin.Username,
                    password:MyLogin.Password,
                }));
                    document.getElementById("SignUp").innerHTML = "<aside>Thank you, "+MyLogin.firstName+".Your profile is now created. To explore all the events nearby, please login.</aside>"
                    MyLogin.firstName  = "";
                    MyLogin.lastName = "";
                    MyLogin.emailAddress = "";
                    MyLogin.Username = "";
                    MyLogin.Password = "";
                    MyLogin.Username_check = false;
                    MyLogin.emailAddress_check = false;
                    console.log('User created');
                
            }else{
                document.getElementById("error").innerText = "FIX ERRORS ABOVE";
                console.log("Please correct the values of the input box filled above");

            }
        }

    },
    computed:{
        
    }
});

function redirect(){
    var stp = new XMLHttpRequest();
    stp.open('get','/index.html', true);
    stp.send();
    stp.onreadystatechange= function(){
    };
}