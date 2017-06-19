//查看目前登入狀況
var user;
var Dname = document.getElementById('Dname');
var profilePic = document.getElementById('profile-pic');
var profileName = document.getElementById('profile-name');
// var kind = ['Charity','Family','Food','Friend','Love','Mood','Travel','Zoo'];
// var kind_chinese = ['公益','家庭','美食','朋友','愛情','心情','旅遊'];

var query = location.search.substring(1);
var parameters = {};
var keyValuePairs = query.split("=");
var Userkey = keyValuePairs[0];
var userValue = keyValuePairs[1];
parameters[key] = userValue;
var toggle = true;

var key,userBlock;

firebase.auth().onAuthStateChanged(function(user) {
  console.log(user);
    user = user;

    if( user!=null && ( user.uid == userValue || userValue ==null)){
      if(user.photoURL != null && profilePic != null){
        if(user.providerData[0].providerId == "facebook.com"){
          profilePic.src = "https://graph.facebook.com/" + user.providerData[0].uid +"/picture?height=500";
        }else{
          profilePic.src = user.photoURL;
        }
        profileName.innerHTML = user.displayName;
      } else {
        profilePic.src = "img/man.png";
      }
      addArticle(user.uid);
    } else{

      firebase.database().ref('/users/'+userValue).once('value').then(function(snapshot){
        if(snapshot.val().pic != null && profilePic != null){
          profilePic.src = snapshot.val().pic;
          profileName.innerHTML = snapshot.val().name;
        } else {
          profilePic.src = "img/man.png";
          profileName.innerHTML = "♕ 使用者 ♕"; 
        }
      });
      addArticle(userValue);
    }
    // user.sendEmailVerification(); 送驗證信
});

// 放上文章
function addArticle(user){
  firebase.database().ref('/users/'+user+'/post').once('value',function(snapshot){
    snapshot.forEach(function(childSnapshot) {
      var content = childSnapshot.val();
      console.log(content);

      var userTitle = document.createElement("h2");
      userTitle.innerHTML=content.title;

      var userKind = document.createElement("h3");
      userKind.innerHTML="關於："+content.type+"&emsp;&emsp;日期："+content.date;;

      var userContent = document.createElement("p");
      if(content.p_content.split("\n")[1] != undefined){
        userContent.innerHTML= content.p_content.split("\n")[0]+content.p_content.split("\n")[1]+"...";
      }else{
        userContent.innerHTML= content.p_content.split("\n")[0];
      }

      var userPic = document.createElement("img");
      userPic.src = content.p_photo;
      userPic.style.width = "100%";

      var keepReading = document.createElement("a");
      keepReading.innerHTML = "繼續閱讀";
      keepReading.className += "keepRead";
      keepReading.href = "/article.html?key=" + content.article_key;

      // 刪除文章的按鈕
      // var deleteBtn = document.createElement("button");
      // deleteBtn.innerHTML="刪除文章";
      // deleteBtn.onclick = function(){
      //   alert("確認刪除文章?");
      //   console.log(content.key);
      //   firebase.database().ref('/Post/'+content.kind+"/"+content.key).remove();
      //   this.parentNode.remove();
      // };

      userBlock = document.createElement("div");
      userBlock.prepend(userPic);
      userBlock.append(userTitle);
      userBlock.append(userKind);
      userBlock.append(userContent);
      userBlock.append(keepReading);
      document.querySelector('body').classList.add('loaded');
      document.querySelector('body').classList.add('loaded');
      contents.prepend(userBlock);
    });
  });
}

