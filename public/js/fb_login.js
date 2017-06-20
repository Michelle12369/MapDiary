//如果使用者操作了更改密碼、刪除帳號、更改信箱等，需要再次驗證
/*var user = firebase.auth().currentUser;
var credential = firebase.auth().EmailAuthProvider.credential(
  user.email,
  //password from user
)*/

var provider = new firebase.auth.FacebookAuthProvider();
//所需授權的Scope 
//查閱 https://developers.facebook.com/docs/facebook-login/permissions
provider.addScope('user_birthday');
provider.setCustomParameters({
  'display': 'popup'
});


//使用Popup註冊FB方式
var fbLoginBtn = document.getElementById("fbLoginBtn");

fbLoginBtn.addEventListener("click",function(){
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // 取得FB Token，可以使用於FB API中
    var token = result.credential.accessToken;
    // 使用者資料
    var FBUser = result.user;
    console.log(FBUser);
    console.log(FBUser.displayName);
    loginUser = firebase.auth().currentUser;
	  // console.log("登入使用者為",loginUser);
    var fbuid = loginUser.providerData[0].uid;
    var photoUrl = "https://graph.facebook.com/" + fbuid +"/picture?height=500";
    console.log(photoUrl);

    firebase.database().ref('users/' + loginUser.uid).update({
      userid: loginUser.uid,
	    email: loginUser.email,
      name: loginUser.displayName,
      pic: photoUrl,
      fb: fbuid
    });


    document.location.href='/index.html';


    // console.log(loginUser.photoURL);
    // firebase.storage().ref().child('users').set(loginUser.photoURL).then(function(snapshot) {
    //   console.log("pic save");
    // });
  
  }).catch(function(error) {
    //處理 帳號已經存在於其他登入方式時
    if (error.code === 'auth/account-exists-with-different-credential') {
      //取得credential
      var pendingCred = error.credential;
      // The provider account's email address.
      var email = error.email;
      console.log("FB登入錯誤-使用者信箱：",email);
      // 取得當初此Email的登入方式
      firebase.auth().fetchProvidersForEmail(email).then(function(providers) {
        // 如果使用者有多個登入方式的話
        console.log("FB登入錯誤-其他登入方式：",providers);
        if (providers[0] === 'password') {
          // 如果使用者用密碼登入，要求使用者輸入密碼
          var password = promptUserForPassword(); // TODO: 實作 promptUserForPassword.
          firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
            // Step 4a.
            return user.link(pendingCred);
          }).then(function() {
            // 成功連結
            goToApp();
          });
          return;
        }
        // 如果是其他登入方式，必須取得該登入方式,同時提供相對應的Provider
        // TODO: implement getProviderForProviderId.
        var provider = getProviderForProviderId(providers[0]);
        // 此時你必須讓使用者了解到 他曾經用其他方式登入過
        // Note: 瀏覽器通常會擋住跳出頁面，所以在現實狀況下，最好有個"請繼續"按鈕觸發新的註冊頁面
        // 可以參考 https://fir-ui-demo-84a6c.firebaseapp.com/
        auth.signInWithPopup(provider).then(function(result) {
          // 如果使用者用不同Email登入同一個帳號，這樣Firebase是無法擋住的
          // Step 4b.
          // 連結回原本的credential
          result.user.link(pendingCred).then(function() {
            // 成功連結
            goToApp();
          });
        });
      });
    }
  });
},false);
