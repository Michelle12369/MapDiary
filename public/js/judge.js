//查看目前登入狀況
var user;
var Dname = document.getElementById('Dname');
var profilePic = document.getElementById('profile-pic');
var profileName = document.getElementById('profile-name');
var kind = ['Charity','Family','Food','Friend','Love','Mood','Travel'];
var kind_chinese = ['公益','家庭','美食','朋友','愛情','心情','旅遊'];

var query = location.search.substring(1);
var parameters = {};
var keyValuePairs = query.split("=");
var key = keyValuePairs[0];
var userValue = keyValuePairs[1];
parameters[key] = userValue;
var toggle = true;

// console.log(location.search.substring(1));
// console.log("value:" + value);


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    user = user;
    
    if(user.uid == userValue || userValue ==null){
      if(user.photoURL != null){
        // var img = document.createElement("img");
        // img.src = user.photoURL;
        if(profilePic != null){
          profilePic.src = user.photoURL;
          profileName.innerHTML = user.displayName;
        }
      } else {
        console.log(profilePic);
        profilePic.src = "img/man.png";
      }
      kind.forEach(function(value,index){
        firebase.database().ref('/Post/'+value).once('value').then(function(snapshot) {
          // console.log(snapshot.key.userid);
          // console.log(Object.keys(snapshot.val())[0]);
          var contents = document.getElementById('contents');
          var key = Object.keys(snapshot.val());
          var j = 0;
          for(var i = 0 ; i < Object.keys(snapshot.val()).length ; i++){
            // console.log(snapshot.child(key[i]).val().userid);
            // console.log("user.userid:"+user.uid);
            if(snapshot.child(key[i]).val().userid == user.uid){
              
              var userTitle = document.createElement("h1");
              userTitle.innerHTML=snapshot.child(key[i]).val().title;

              var userKind = document.createElement("h3");
              userKind.innerHTML="種類："+ kind_chinese[index];

              var userContent = document.createElement("p");
              userContent.innerHTML=snapshot.child(key[i]).val().p_content;
              
              var userPic = document.createElement("img");
              userPic.src = snapshot.child(key[i]).val().p_photo;
              userPic.style.width = "100%";

              // console.log(Object.keys(snapshot.val())[i]);
              var aTag = document.createElement("a");
              aTag.href = "/article.html?key=" + Object.keys(snapshot.val())[i];
              aTag.prepend(userPic);
              aTag.append(userTitle);
              aTag.append(userKind);
              aTag.append(userContent);

              var userBlock = document.createElement("div");
              userBlock.append(aTag);

              contents.append(userBlock);
              j++;
            }
            if(j==0){
              var none = document.createElement("p");
              contents.prepend(none);
            }
          }
        })  
      })
    } else{
      firebase.database().ref('/users/'+userValue).once('value').then(function(snapshot){
        console.log(snapshot.val());
        // profilePic.src = snapshot.val().pic;
        // profileName.innerHTML = snapshot.val().name;
        if(snapshot.val().pic != null && profilePic != null){
          console.log("sss");
          profilePic.src = snapshot.val().pic;
          profileName.innerHTML = snapshot.val().name;
        } else {
          profilePic.src = "img/man.png";
          profileName.innerHTML = "♕ 使用者 ♕"; 
        }
      });
      
      kind.forEach(function(value,index){
        firebase.database().ref('/Post/'+value).once('value').then(function(snapshot) {
          // console.log(snapshot.val());
          var key = Object.keys(snapshot.val());
          for(var i = 0 ; i < Object.keys(snapshot.val()).length ; i++){
            // console.log(snapshot.child(key[i]).val().userid);
            // console.log("value = " + userValue);
            if(snapshot.child(key[i]).val().userid == userValue){

              var userTitle = document.createElement("h1");
              userTitle.innerHTML=snapshot.child(key[i]).val().title;

              var userKind = document.createElement("h3");
              userKind.innerHTML="種類："+ kind_chinese[index];

              var userContent = document.createElement("p");
              userContent.innerHTML=snapshot.child(key[i]).val().p_content;
              
              var userPic = document.createElement("img");
              userPic.src = snapshot.child(key[i]).val().p_photo;
              userPic.style.width = "100%";

              // console.log(Object.keys(snapshot.val())[i]);
              var aTag = document.createElement("a");
              aTag.href = "/article.html?key=" + Object.keys(snapshot.val())[i];
              aTag.prepend(userPic);
              aTag.append(userTitle);
              aTag.append(userKind);
              aTag.append(userContent);

              var userBlock = document.createElement("div");
              userBlock.append(aTag);

              contents.append(userBlock);
            }
          }
        });
      });
    }
    // user.sendEmailVerification(); 送驗證信
  } else {
    user = null;
    console.log("User is not logined yet.");
  }
});




