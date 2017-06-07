//查看目前登入狀況
var user;
var Dname = document.getElementById('Dname');
var profilePic = document.getElementById('profile-pic');
var profileName = document.getElementById('profile-name');
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    user = user;
    if(user.photoURL != null){
      var img = document.createElement("img");
      img.src = user.photoURL;

      if(profilePic != null){
        profilePic.src = user.photoURL;
        profileName.innerHTML = user.displayName;
      }
      firebase.database().ref('/Post/Food').once('value').then(function(snapshot) {
        // console.log(snapshot.key.userid);

        // console.log(Object.keys(snapshot.val())[0]);
        var contents = document.getElementById('contents');
        var key = Object.keys(snapshot.val());
        var j = 0;
        for(var i = 0 ; i < Object.keys(snapshot.val()).length ; i++){
          console.log(snapshot.child(key[i]).val().userid);
          if(snapshot.child(key[i]).val().userid == user.email){
            
            var userTitle = document.createElement("h1");
            userTitle.innerHTML=snapshot.child(key[i]).val().title;

            var userContent = document.createElement("p");
            userContent.innerHTML=snapshot.child(key[i]).val().p_content;
            
            var userBlock = document.createElement("div");
            userBlock.append(userTitle);
            userBlock.append(userContent);

            contents.prepend(userBlock);
            j++;
          }
          if(j==0){
            var none = document.createElement("p");
            contents.prepend(none);
          }
        }
      })
    } else {
      console.log(profilePic);
      profilePic.src = "img/man.png";
      // var i = user.email.indexOf("@");
      // Dname.innerHTML = user.email.slice(0,i)+"您好";
    }
    // user.sendEmailVerification(); 送驗證信
  } else {
    user = null;
    console.log("User is not logined yet.");
  }
});