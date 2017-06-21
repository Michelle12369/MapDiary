var provider2 = new firebase.auth.GoogleAuthProvider(); 


var googleLoginBtn = document.getElementById("googleLoginBtn");

googleLoginBtn.addEventListener("click",function(){
	firebase.auth().signInWithPopup(provider2).then(function(result) {      
		var token         = result.credential.accessToken;      
		var user          = result.user;      // 使用者資訊
		var photoURL		= result.user.photoURL;

		console.log(user);

	    firebase.database().ref('users/' + user.uid).update({
	      userid: user.uid,
		  email: user.email,
	      name: user.displayName,
	      pic: user.photoURL
	    });

	    console.log("google2");
	}).catch(function(error) {
	  // 處理錯誤
	  var errorCode     = error.code;
	  var errorMessage  = error.message;     
	  var email         = error.email;      // 使用者所使用的 Email
	  var credential    = error.credential;
	  console.log(error);
	});
});