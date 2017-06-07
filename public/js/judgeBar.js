//查看目前登入狀況
var user;
var Dname = document.getElementById('Dname');
var SignIn = document.getElementById('SignIn');
var profilePic = document.getElementById('profile-pic');
var profileName = document.getElementById('profile-name');
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    user = user;
    console.log(user.photoURL);
    if(user.photoURL != null){
      // Dname.innerHTML = user.displayName+"您好";
      var img = document.createElement("img");
      img.src = user.photoURL;
      // console.log(img);
      Dname.append(img);
      SignIn.innerHTML = "";
      if(profilePic != null){
        profilePic.src = user.photoURL;
        profileName.innerHTML = user.displayName;
      }
    } else {
      var i = user.email.indexOf("@");
      Dname.innerHTML = user.email.slice(0,i)+"您好";
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