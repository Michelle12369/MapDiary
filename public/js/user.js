//查看目前登入狀況
var user;
var Dname = document.getElementById('Dname');
var profilePic = document.getElementById('profile-pic');
var profileName = document.getElementById('profile-name');
var kind = ['Charity','Family','Food','Friend','Love','Mood','Travel','Zoo'];
var kind_chinese = ['公益','家庭','美食','朋友','愛情','心情','旅遊'];

var query = location.search.substring(1);
var parameters = {};
var keyValuePairs = query.split("=");
var Userkey = keyValuePairs[0];
var userValue = keyValuePairs[1];
parameters[key] = userValue;
var toggle = true;

var story = [];
var posts = [];
var key;
var userBlock;
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    user = user;
    
    if( user.uid == userValue || userValue ==null){
      if(user.photoURL != null && profilePic != null){
        // profilePic.src = user.photoURL;
        console.log(user.providerData[0].providerId );

        if(user.providerData[0].providerId == "facebook.com"){
          profilePic.src = "https://graph.facebook.com/" + user.providerData[0].uid +"/picture?height=500";
        }else{
          profilePic.src = user.photoURL;
        }
        profileName.innerHTML = user.displayName;
      } else {
        profilePic.src = "img/man.png";
      }
      kind.forEach(function(value,index){
        firebase.database().ref('/Post/'+value).once('value').then(function(snapshot) {
          var contents = document.getElementById('contents');
          // var key = Object.keys(snapshot.val());
          snapshot.forEach(function(userSnapshot) {
            if(userSnapshot.val().userid == user.uid){
              var id = userSnapshot.key;
              posts.push({
                id : userSnapshot.val(),
                key: userSnapshot.key,
                kind: value
              });
              // 照時間排序
              posts.sort(compare);
            };
            if(value=="Zoo"){
              addSelfBlock();
            }
          });
        });
      });
    } else{
      console.log(userValue);
      firebase.database().ref('/users/'+userValue).once('value').then(function(snapshot){
        if(snapshot.val().pic != null && profilePic != null){
          profilePic.src = snapshot.val().pic;
          profileName.innerHTML = snapshot.val().name;
        } else {
          profilePic.src = "img/man.png";
          profileName.innerHTML = "♕ 使用者 ♕"; 
        }
      });

      kind.forEach(function(value,index){
        firebase.database().ref('/Post/'+value).once('value').then(function(snapshot) {
          var contents = document.getElementById('contents');
          var key = Object.keys(snapshot.val());
          snapshot.forEach(function(userSnapshot) {
            if(userSnapshot.val().userid == userValue){
              var id = userSnapshot.key;
              posts.push({
                id : userSnapshot.val(),
                key: userSnapshot.key,
                kind: value
              });
              // 照時間排序
              posts.sort(compare);
              
            };
            if(value=="Zoo"){
              addBlock();
              
            }
          });
        });
      });
    }
    // user.sendEmailVerification(); 送驗證信
  } else {
    user = null;
    console.log("User is not logined yet.");
  }
  
});

// 放上文章
function addBlock(){
  posts.forEach(function(content){
    var userTitle = document.createElement("h2");
    userTitle.innerHTML=content.id.title;

    var userKind = document.createElement("h3");
    userKind.innerHTML="種類："+content.kind+"&emsp;&emsp;日期："+content.id.date;;

    var userContent = document.createElement("p");
    if(content.id.p_content.split("\n")[1] != undefined){
      userContent.innerHTML= content.id.p_content.split("\n")[0]+content.id.p_content.split("\n")[1]+"...";
    }else{
      userContent.innerHTML= content.id.p_content.split("\n")[0];
    }

    var userPic = document.createElement("img");
    userPic.src = content.id.p_photo;
    userPic.style.width = "100%";

    var keepReading = document.createElement("a");
    keepReading.innerHTML = "繼續閱讀";
    keepReading.className += "keepRead";
    keepReading.href = "/article.html?key=" + content.key;



    var aTag = document.createElement("a");
    aTag.prepend(userPic);
    aTag.append(userTitle);
    aTag.append(userKind);
    aTag.append(userContent);

    userBlock = document.createElement("div");
    userBlock.append(aTag);
    userBlock.append(keepReading);

    contents.append(userBlock);

    
  });
};

// 放上個人文章
function addSelfBlock(){
  posts.forEach(function(content){
    var userTitle = document.createElement("h2");
    userTitle.innerHTML=content.id.title;

    console.log(content.id.date);
    var userKind = document.createElement("h3");
    userKind.innerHTML="種類："+content.kind+"&emsp;&emsp;日期："+content.id.date;

    var userContent = document.createElement("p");
    // content.id.p_content.split("\n");
    if(content.id.p_content.split("\n")[1] != undefined){
      userContent.innerHTML= content.id.p_content.split("\n")[0]+content.id.p_content.split("\n")[1]+"...";
    }else{
      userContent.innerHTML= content.id.p_content.split("\n")[0];
    }
    var userPic = document.createElement("img");
    userPic.src = content.id.p_photo;
    userPic.style.width = "100%";

    var keepReading = document.createElement("a");
    keepReading.innerHTML = "繼續閱讀";
    keepReading.className += "keepRead";
    keepReading.href = "/article.html?key=" + content.key;

    // 刪除文章的按鈕
    // var deleteBtn = document.createElement("button");
    // deleteBtn.innerHTML="刪除文章";
    // deleteBtn.onclick = function(){
    //   alert("確認刪除文章?");
    //   console.log(content.key);
    //   firebase.database().ref('/Post/'+content.kind+"/"+content.key).remove();
    //   this.parentNode.remove();
    // };

    var aTag = document.createElement("a");
    aTag.prepend(userPic);
    aTag.append(userTitle);
    aTag.append(userKind);
    aTag.append(userContent);


    userBlock = document.createElement("div");
    userBlock.append(aTag);
    userBlock.append(keepReading);
    // userBlock.append(deleteBtn);

    contents.append(userBlock);
    document.querySelector('body').classList.add('loaded');
  });
};

var deleteF;



// 按發文排序
function compare(a,b) {
  if (a.id.timestamp > b.id.timestamp)
    return -1;
  if (a.id.timestamp < b.id.timestamp)
    return 1;
  return 0;
}


