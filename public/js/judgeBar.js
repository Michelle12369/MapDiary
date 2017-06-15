//查看目前登入狀況
var user;
var Dname = document.getElementById('Dname');
var SignIn = document.getElementById('SignIn');
var profileName = document.getElementById('profile-name');
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    user = user;
     // console.log(SignIn);
    SignIn.innerHTML = "";
    if(user.photoURL != null){

      var toUser = document.createElement("a");
      var img = document.createElement("img");
      img.src = user.photoURL;
      toUser.append(img);
      img.className += " dropclick";

      var triangle = document.createElement("span");
      // triangle.innerHTML = "▼";
      // triangle.className += " dropclick";

      Dname.append(toUser);
      Dname.append(triangle);

    } else {
      var toUser = document.createElement("a");
      var img = document.createElement("img");
      img.src = "img/man.png";
      toUser.append(img);
      img.className += " dropclick";

      var triangle = document.createElement("span");
      // triangle.innerHTML = "▼";
      // triangle.className += " dropclick";

      Dname.append(toUser);
      Dname.append(triangle);

      // var i = user.email.indexOf("@");
      // Dname.innerHTML = user.email.slice(0,i)+"您好";
    }
    // user.sendEmailVerification(); 送驗證信
  } else {
    user = null;
    var sign = document.createElement("span");
    sign.innerHTML = "立即註冊";
    console.log(sign);
    SignIn.append(sign);
    Dname.innerHTML = "";
    console.log("User is not logined yet.!");
  }
});

//登出
var signoutSmtBtn = document.getElementById("signoutSmtBtn");
signoutSmtBtn.addEventListener("click",function(){
  firebase.auth().signOut().then(function() {
    console.log("User sign out!");
    document.location.href='/index.html';
  }, function(error) {
    console.log("User sign out error!");
  })
},false);

