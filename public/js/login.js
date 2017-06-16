
var database = firebase.database();

//登入
var accountL = document.getElementById("accountL");
var pwdL = document.getElementById("pwdL");
var loginSmtBtn = document.getElementById("loginSmtBtn");
if(loginSmtBtn!=null){
  loginSmtBtn.addEventListener("click",function(){
    console.log(accountL.value);
    firebase.auth().signInWithEmailAndPassword(accountL.value, pwdL.value).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    })
  },false);
}


//Email驗證
var verifyBtn = document.getElementById("verifyBtn");
if(verifyBtn!=null){
  verifyBtn.addEventListener("click",function(){
    user.sendEmailVerification().then(function() {
      console.log("驗證信寄出");
    }, function(error) {
      console.error("驗證信錯誤");
    });
  },false);
}

//更改密碼
var chgPwd = document.getElementById("chgPwd");
if(chgPwdBtn != null){
  var chgPwdBtn = document.getElementById("chgPwdBtn");
  chgPwdBtn.addEventListener("click",function(){
    firebase.auth().sendPasswordResetEmail(chgPwd.value).then(function() {
      // Email sent.
      console.log("更改密碼Email已發送");
      chgPwd.value = "";
    }, function(error) {
      // An error happened.
      console.error("更改密碼",error);
    });
  },false);
}


firebase.auth().onAuthStateChanged(function(user) {
  if(user !=null){
    document.location.href='/index.html';
  }
});
