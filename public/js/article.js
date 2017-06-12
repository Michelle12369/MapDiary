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
var like_div = document.querySelector('.like');
//留言 (目前使用者)
var current_comment_user = document.querySelector('#current_comment_user');
var current_user_page = document.querySelector('#current_user_page');
var comment_input = document.querySelector('#comment_input');
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

          firebase.auth().onAuthStateChanged(function(user) {

              if (childData2.userid == user.uid){

                document.querySelector('#change_post').style.visibility = 'visible';

              }

           });


          date.innerHTML = childData2.date+" # ";
          type.innerHTML = "關於 "+category;
            content.innerHTML = childData2.p_content;
            //未來: 經緯度轉換成地址
            //map.src = map_url+'&q='+childData2.lat+','+childData2.lng;
            image.src = childData2.p_photo;
            like.innerHTML = childData2.like_count;
            like_div.style.visibility = 'visible';
            c = category;
            id = postId;
            lat = childData2.lat;
            lng = childData2.lng;
        }

    });
  });



  firebase.auth().onAuthStateChanged(function(user) {

        if(user){

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

        //連接使用者留言照片、留言網頁
        var userRef = firebase.database().ref('users/'+user.uid);
        userRef.once('value',function(snapshot){

         current_comment_user.style = 'visible';
         comment_input.style = 'visible';
         current_user_page.href = 'user.html?key='+user.uid;

         if(!snapshot.val().pic){

          current_comment_user.src = 'img/man.png';

         }else{

           current_comment_user.src = snapshot.val().pic;

         }

        });

      }else{ }

      var commentsRef = firebase.database().ref('Comment/'+id);
      commentsRef.on('child_added', function(snap) {

        document.querySelector('#commentlist').innerHTML += commentHtmlFromObject(snap.val());
        
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
        var username; 
        if (!user.displayName){

          username = '匿名使用者';

        }else{

          username = user.displayName;

        }


        // 點擊愛心
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

            
        //提交comment 
        comment_input.addEventListener("keyup",function(event){
                  
          event.preventDefault();

          if (event.keyCode == 13) {

            var d = new Date();
            var date = d.toLocaleDateString()+" "+d.toLocaleTimeString();
            var timestamp = Math.floor(Date.now());

            //判斷留言是否為空白
            if (!comment_input.value){

              //不可提交空白留言

            }else{

            //上傳留言到firebase
            var commentRef = firebase.database().ref('Comment/'+id);
            commentRef.child(timestamp).set({

              userid: userid,
              c_content: comment_input.value,
              username: username,
              date: date,
              timestamp: timestamp,
              photo_url: current_comment_user.src

            })

              comment_input.value = '';

                  }
          }

        });

        //刪除文章
        document.querySelector('#delete').addEventListener('click',function(){


              
           // var delete_id = this.id;//delete btn1 btn2 ...
           // var i = delete_id.split('delete')[1] - 1;//得到key1 key2 key3...

          
           // var r=confirm("確定刪除？")
           //  if (r==true){
           //  articleRef.child(keyArr[i]).remove();
           //  location.reload(); //*可能需要ajax
           //  }  


        });










     } else {
                      
          user = null;
          //alert ('您尚未登入');                
          }

 });




 //新增留言架構
 function commentHtmlFromObject(commentlist){

       var html = '';
        html += '<hr>';
          html += '<div class="comment-container">';
           html += '<div class="user-pic">';
            html += '<a href="user.html?key='+commentlist.userid+'">';
            html += '<img src="'+commentlist.photo_url+'">';
            html += '</a>';
             html += '</div>';
          html += '<div class="user-comment">';
        html += '<div><a href="user.html?key='+commentlist.userid+'">'+commentlist.username+'</a></div>';
        html += '<div>'+commentlist.c_content+'</div>';
        html += '</div>';
        html += '</div>';
        return html;

 }