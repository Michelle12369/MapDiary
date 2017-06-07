//登出
var signoutSmtBtn = document.getElementById("signoutSmtBtn");
if(signoutSmtBtn!=null){
	signoutSmtBtn.addEventListener("click",function(){
	  firebase.auth().signOut().then(function() {
	    console.log("User sign out!");
	  }, function(error) {
	    console.log("User sign out error!");
	  })
	},false);
}