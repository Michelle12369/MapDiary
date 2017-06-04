// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
  console.log('statusChangeCallback');
  console.log(response);
  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  if (response.status === 'connected') {
    // Logged into your app and Facebook.
    testAPI(response);

  } else {
    // The person is not logged into your app or we are unable to tell.
    document.getElementById('status').innerHTML = 'Please log ' +
      'into this app.';
  }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

window.fbAsyncInit = function() {
FB.init({
  appId      : '183823402146125',
  cookie     : true,  // enable cookies to allow the server to access 
                      // the session
  xfbml      : true,  // parse social plugins on this page
  version    : 'v2.8' // use graph api version 2.8
});

// Now that we've initialized the JavaScript SDK, we call 
// FB.getLoginStatus().  This function gets the state of the
// person visiting this page and can return one of three states to
// the callback you provide.  They can be:
//
// 1. Logged into your app ('connected')
// 2. Logged into Facebook, but not your app ('not_authorized')
// 3. Not logged into Facebook and can't tell if they are logged into
//    your app or not.
//
// These three cases are handled in the callback function.

FB.getLoginStatus(function(response) {
  statusChangeCallback(response);
});

};

// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI(a) {
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me', 'GET',{
  	"fields": "email,first_name,name,gender"
  },function(response) {
    console.log('Successful login for: ' + response.name);
    document.getElementById('status').innerHTML =
      'Thanks for logging in, ' + response.name + '!';
      // console.log(response.id);
      // console.log(response.email);
      // console.log(response.name);
      // console.log(response.gender);
      var email = response.email;
      var password = "1234567890"
      // var token = a.authResponse.accessToken;
   //    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
			//   // Handle Errors here.
			//   var errorCode = error.code;
			//   var errorMessage = error.message;
			// });
  });
  FB.api( //拿大頭貼
    '/me/picture',
    'GET', {
        "fields": "redirect,url",
        "type": "normal"
    },
    function(response) {
        document.getElementById('pic').src = response.data.url;
        document.getElementById('pic-small').src = response.data.url;
   	}
	);
	var b = a.authResponse.userID;
	console.log(b);
	firebase.database().ref('User/').push().set({
		userID: b,
		rrr:'rrr'
	});
}

function logout() {
	FB.logout(function(response) {
	    checkLoginState();
	    // user is now logged out
	});
}


// var firebase = require("firebase/app");
// require("firebase/auth");
// require("firebase/database");




// var provider = new firebase.auth.FacebookAuthProvider();

// provider.addScope('user_birthday');
// provider.setCustomParameters({
//   'display': 'popup'
// });
// firebase.auth().signInWithPopup(provider).then(function(result) {
//   // This gives you a Facebook Access Token. You can use it to access the Facebook API.
//   var token = result.credential.accessToken;
//   // The signed-in user info.
//   var user = result.user;
//   // ...
// }).catch(function(error) {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   // The email of the user's account used.
//   var email = error.email;
//   // The firebase.auth.AuthCredential type that was used.
//   var credential = error.credential;
//   // ...
// });

// firebase.auth().signInWithRedirect(provider);

// firebase.auth().getRedirectResult().then(function(result) {
//   if (result.credential) {
//     // This gives you a Facebook Access Token. You can use it to access the Facebook API.
//     var token = result.credential.accessToken;
//     // ...
//   }
//   // The signed-in user info.
//   var user = result.user;
// }).catch(function(error) {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   // The email of the user's account used.
//   var email = error.email;
//   // The firebase.auth.AuthCredential type that was used.
//   var credential = error.credential;
//   // ...
// });

var rootRef = firebase.database().ref();
var adaRef = firebase.database().ref("User/ada");

var signIn = document.getElementById("signIn");

signIn.addEventListener("click",function(){
	var email = document.getElementById("email").value;
	var password = document.getElementById("pwd").value;
	signIn1(email,password);
});


// 登入
function signIn1(email,password){
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // ...
		console.log("登入失敗");
	});
}
// 登出
function signOut(){
	firebase.auth().signOut().then(function() {
	  // Sign-out successful.
	}).catch(function(error) {
	  // An error happened.
	});
}


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // window.location.replace("/index.html");
  }
});
