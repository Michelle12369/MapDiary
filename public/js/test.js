
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    user = user;
    console.log(user.displayName);
    console.log("User is logined", user);
    firebase.database().ref('users/' + loginUser.uid).set("資料");
  } else {
    user = null;
    console.log("User is not logined yet.");
  }
});