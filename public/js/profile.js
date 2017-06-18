var query = location.search.substring(1);
var parameters = {};
var keyValuePairs = query.split("=");
var Userkey = keyValuePairs[0];
var userValue = keyValuePairs[1];
// parameters[key] = userValue;
var toggle = true;

var profilePic = document.getElementById('profile-pic');
var profileName = document.getElementById('profile-name');

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    user = user;
    if(user.uid == userValue || userValue ==null){
      if(user.photoURL != null && profilePic != null){
        profilePic.src = user.photoURL;
        profileName.innerHTML = user.displayName;
      } else {
        console.log(profilePic);
        profilePic.src = "img/man.png";
      }
    }
  }
});