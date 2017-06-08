//Email/Pwd註冊
var account = document.getElementById("account");
var pwd = document.getElementById("pwds");
var registerSmtBtn = document.getElementById("registerSmtBtn");
registerSmtBtn.addEventListener("click", function(){
    console.log(account.value);
    firebase.auth().createUserWithEmailAndPassword(account.value, pwd.value).then(function(){
    	loginUser = firebase.auth().currentUser;
    	console.log("登入使用者為",loginUser);
    	console.log(loginUser.uid);
	    firebase.database().ref('users/' + loginUser.uid).set({
	    	userid: loginUser.uid,
		    email: loginUser.email,
	        name: loginUser.displayName,
	        // age : age.value
	    	// "資料"
	    });
    }).catch(function(error) {
    	// Handle Errors here.
	    var errorCode = error.code;
	    var errorMsg = error.message;
	    // console.log(errorMsg);
  	});
},false);
