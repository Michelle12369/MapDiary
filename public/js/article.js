//
var title = document.querySelector('#title');
var author = document.querySelector('#author');
var date = document.querySelector('#date');
var type = document.querySelector('#category');
var image = document.querySelector('#image');
var content = document.querySelector('#content');
var map = document.querySelector('iframe');
var like = document.querySelector('#like');
var map_url = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBy5JYq1_BVxB1A2Xtofn9PcRryxQJ4Ess';
var c,id;

//Get the post ID (parameter) passed from search.html
var query = location.search.substring(1);
var parameters = {};
var keyValuePairs = query.split("=");
var key = keyValuePairs[0];
var value = keyValuePairs[1];
parameters[key] = value;

// var query = location.search.substring(1);
// var parameters = {};
// var keyValues = query.split(/&/);
// for (var keyValue in keyValues) {
//     var keyValuePairs = keyValue.split(/=/);
//     var key = keyValuePairs[0];
//     var value = keyValuePairs[1];
//     parameters[key] = value;
// }

// alert(parameters['yourKey']);

//只傳入ID
var postRef = firebase.database().ref('Post');
postRef.on('value', function(snapshot) {
  
	snapshot.forEach(function(childSnapshot) {

	  var category = childSnapshot.key;

 	  childSnapshot.forEach(function(postIDSnapshot){

      	var postId = postIDSnapshot.key;
      	var childData2 = postIDSnapshot.val();

      	if (postId == value){
      
      		title.innerHTML = childData2.title;
      		author.innerHTML = childData2.userid+" # ";
      		date.innerHTML = childData2.date+" # ";
      		type.innerHTML = "關於 "+category;
            content.innerHTML = childData2.p_content;
            //未來: 經緯度轉換成地址
            map.src = map_url+'&q='+childData2.lat+','+childData2.lng;
            image.src = childData2.p_photo;
            like.innerHTML = childData2.like_count;
            console.log(childData2.like_count);

            c = category;
            id = postId;

  		
      	}

 	  });
  });
});


document.querySelector(".likes-count").addEventListener('click',function(e){
   this.classList.toggle("like-click") ;

   console.log(c+"="+id);
   













   
});
