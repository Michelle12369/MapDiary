//
var title = document.querySelector('#title');
var author = document.querySelector('#author');
var date = document.querySelector('#date');
var type = document.querySelector('#category');
var image = document.querySelector('#image');
var content = document.querySelector('#content');
var map = document.querySelector('iframe');
var like = document.querySelector('#like');
var heart = document.querySelector('#heart_btn');
var c,id,lat,lng;

//Get the post ID (parameter) passed from search.html
var query = location.search.substring(1);
var parameters = {};
var keyValuePairs = query.split("=");
var key = keyValuePairs[0];
var value = keyValuePairs[1];
parameters[key] = value;
var toggle = true;
var postRef = firebase.database().ref('Post');





function initMap() {


postRef.on('value', function(snapshot) {
  
  snapshot.forEach(function(childSnapshot) {

    var category = childSnapshot.key;

    childSnapshot.forEach(function(postIDSnapshot){

        var postId = postIDSnapshot.key;
        var childData2 = postIDSnapshot.val();

        if (postId == value){
      
          title.innerHTML = childData2.title;

          if (!childData2.username){

             author.innerHTML = '匿名使用者'+" # ";

          }else{

             author.innerHTML = childData2.username+" # ";

          }
          date.innerHTML = childData2.date+" # ";
          type.innerHTML = "關於 "+category;
            content.innerHTML = childData2.p_content;
            //未來: 經緯度轉換成地址
            //map.src = map_url+'&q='+childData2.lat+','+childData2.lng;
            image.src = childData2.p_photo;
            like.innerHTML = childData2.like_count;
            console.log(childData2.like_count);

            c = category;
            id = postId;
            lat = childData2.lat;
            lng = childData2.lng;


      
        }

    });
  });




  firebase.auth().onAuthStateChanged(function(user) {



        var likeRef2 = firebase.database().ref('Post/'+c+'/'+id);
        likeRef2.once('value',function(snapshot){


                 //如果有likes欄位->已經有人按讚、如果likes欄位有使用者的ID -> 已經按過讚了
                    if(snapshot.child('like_user').exists() && snapshot.child('like_user').hasChild(user.uid)){

                      heart.classList.add('likes-count');
                      heart.classList.toggle('like-click');
                      
                                      
                    }else{

                                 
                      heart.classList.add('likes-count');
                                       


                       }



        });







  });



      var uluru = {lat: lat, lng: lng};
      var map = new google.maps.Map(document.getElementById('GoogleMap'), {
        zoom: 15,
        center: uluru,
        styles:[
      {
          "featureType": "water",
          "elementType": "all",
          "stylers": [
              {
                  "hue": "#7fc8ed"
              },
              {
                  "saturation": 55
              },
              {
                  "lightness": -6
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "labels",
          "stylers": [
              {
                  "hue": "#7fc8ed"
              },
              {
                  "saturation": 55
              },
              {
                  "lightness": -6
              },
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
              {
                  "hue": "#83cead"
              },
              {
                  "saturation": 1
              },
              {
                  "lightness": -15
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "landscape",
          "elementType": "geometry",
          "stylers": [
              {
                  "hue": "#f3f4f4"
              },
              {
                  "saturation": -84
              },
              {
                  "lightness": 59
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "landscape",
          "elementType": "labels",
          "stylers": [
              {
                  "hue": "#ffffff"
              },
              {
                  "saturation": -100
              },
              {
                  "lightness": 100
              },
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
              {
                  "hue": "#ffffff"
              },
              {
                  "saturation": -100
              },
              {
                  "lightness": 100
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "road",
          "elementType": "labels",
          "stylers": [
              {
                  "hue": "#bbbbbb"
              },
              {
                  "saturation": -100
              },
              {
                  "lightness": 26
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
              {
                  "hue": "#ffcc00"
              },
              {
                  "saturation": 100
              },
              {
                  "lightness": -35
              },
              {
                  "visibility": "simplified"
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
              {
                  "hue": "#ffcc00"
              },
              {
                  "saturation": 100
              },
              {
                  "lightness": -22
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "poi.school",
          "elementType": "all",
          "stylers": [
              {
                  "hue": "#d7e4e4"
              },
              {
                  "saturation": -60
              },
              {
                  "lightness": 23
              },
              {
                  "visibility": "on"
              }
          ]
      }
  ]

       });

    var icon = {

        url: 'img/placeholder.png', // url
        scaledSize: new google.maps.Size(50, 50), // scaled size
        };

    marker = new google.maps.Marker({

            position: uluru,
            map: map,
            animation: google.maps.Animation.DROP,
            icon: icon

        });
     

});


}




firebase.auth().onAuthStateChanged(function(user) {

    if (user) {
              
        var userid = user.uid;  

        heart.addEventListener('click',function(e){
           

              heart.classList.toggle('like-click');
              var likes = like.innerHTML;
              var likeRef = firebase.database().ref('Post/'+c+'/'+id);


              likeRef.once('value',function(snapshot){

                    var count = snapshot.val().like_count;
                   
                  

                    //如果有likes欄位->已經有人按讚、如果likes欄位有使用者的ID -> 已經按過讚了
                    if(snapshot.child('like_user').exists() && snapshot.child('like_user').hasChild(userid)){

                        postRef.child(c).child(id).child('like_user').child(userid).remove();
                        count--;
                        postRef.child(c).child(id).child('like_count').set(count);
                        toggle = false;


                                      
                    }else{

                        postRef.child(c).child(id).child('like_user').child(userid).set(true);
                        count++;
                        postRef.child(c).child(id).child('like_count').set(count);
                        toggle = true;

                       }

                       //改變btn上的讚數
                       like.innerHTML = count;      
              });   

              });

      

     } else {
                      
          user = null;
          //alert ('您尚未登入');                
            
             }

 });


 



