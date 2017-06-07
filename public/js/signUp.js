
var signUp = document.getElementById("signUp");

signUp.addEventListener("click",function(){
	var email = document.getElementById("email").value;
	var password = document.getElementById("pwd").value;
	signUp1(email,password);
});
// 註冊
function signUp1(email,password){
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  console.log("註冊失敗");
	});
}
