//查看目前登入狀況
var user;
var Dname = document.getElementById('Dname');
var SignIn = document.getElementById('SignIn');
var profileName = document.getElementById('profile-name');
var note = document.getElementById('note');
var noteDetail = document.getElementById('noteDetail');
var notekey = [""];
var noteId = "";
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

    //gary
      var toNote = document.createElement('a');
      var noteImg = document.createElement('img');
      noteImg.src = "img/bell.png";
      toNote.appendChild(noteImg);
      noteImg.className += " dropclick";
      note.appendChild(toNote);

      noteId = user.uid;
      var i = 0;
      var noteref = firebase.database().ref('users/'+user.uid+'/notification');
      noteref.on('child_added', function(snap){
        var article = snap.child('article').val();
        var read = snap.child('read').val();
        var reader = snap.child('reader').val();
        var type = snap.child('type').val();
        notekey[i] = snap.getKey();
        i++;

        var detail = document.createElement('a');
        detail.className = "dropdown-item";
        detail.href = "article.html?key="+article;
        if(read==false){
          detail.style.backgroundColor = "lightseagreen"; 
        };
        if(type=="like"){
          detail.innerText = reader+"說你的文章讚";
        }else{
          detail.innerText = reader+"對你的文章留言";
        };
        noteDetail.append(detail);
      });
//gary
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

//gary
note.addEventListener("click",function(){
  var updates = {};
  for(var j=0;j<notekey.length;j++){
    updates['users/'+noteId+'/notification/'+notekey[j]+'/read'] = true;
  }
  firebase.database().ref().update(updates);
});
