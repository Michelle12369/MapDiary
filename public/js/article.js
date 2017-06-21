//
var title = document.querySelector('#title');
var author = document.querySelector('#author');
var date = document.querySelector('#date');
var type = document.querySelector('#category');
var aimage = document.querySelector('#aimage');
var content = document.querySelector('#content');
var map = document.querySelector('iframe');
var like = document.querySelector('#like');
var heart = document.querySelector('#heart_btn');
var like_div = document.querySelector('.like');
var select = document.querySelector('#select');
var select_category = document.querySelector('#select_category');
var input = document.querySelector('#pac-input');
var gps = document.querySelector('#gps');
//修改照片
var modal = document.querySelector('#myModal');
var btn = document.querySelector("#myBtn");
var span = document.getElementsByClassName("close")[0]; 
var selectedFile;
//留言 (目前使用者)
var current_comment_user = document.querySelector('#current_comment_user');
var current_user_page = document.querySelector('#current_user_page');
var comment_input = document.querySelector('#comment_input');
var c,id,lat,lng,uid,uphoto,uname,ulike,userlike,garyid;
//Get the post ID (parameter) passed from search.html
var query = location.search.substring(1);
var parameters = {};
var kVPairs = query.split("&");
var postIdPairs = kVPairs[0].split("=");
var typePairs = kVPairs[1].split("=");
var value = postIdPairs[1]; //value -> postid
var category = typePairs[1]; //postype -> category
//parameters[key] = value;  
//
var toggle = true;
var postRef = firebase.database().ref('Post');
var userRef = firebase.database().ref('users');
//
var style = [
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



function initMap() {


  postRef.child(category).child(value).on('value',function(snapshot){

    var postId = value;
    var childData2 = snapshot.val();

    title.innerHTML = childData2.title;

     if (!childData2.username){

             author.innerHTML = '匿名使用者'+" # ";

          }else{

             var n = childData2.username+" # ";
             author.innerHTML = '<a href="/user.html?key='+childData2.userid+'" target="_blank">'+n+'</a>';

          }


     userRef.child(childData2.userid).on('value',function(snapshot){


            if(snapshot.val().pic){

              document.querySelector('.img-circle').src = snapshot.val().pic;
              document.querySelector('#circle').href = '/user.html?key='+childData2.userid;

            }else{

                    document.querySelector('.img-circle').style.display = 'none';

            }

       

          });




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
           
            like.innerHTML = childData2.like_count;
            like_div.style.visibility = 'visible';
            document.querySelector('#comment-hr').style.visibility = 'visible';
            c = category;
            id = postId;
            lat = childData2.lat;
            lng = childData2.lng;
            uname = childData2.username;
            uid = childData2.userid;
            uphoto = childData2.p_photo;
            ulike = childData2.like_count;
            userlike = childData2.like_user;
            garyid = childData2.userid;
            console.log(garyid);
            if (!childData2.link){

               aimage.src = childData2.p_photo;

            }else{

               title.innerHTML = '<a href="'+childData2.link+'" target="_blank">'+childData2.title+'</a>';
          

            }



        firebase.auth().onAuthStateChanged(function(user) {

        if(user){


        var likeRef2 = firebase.database().ref('Post/'+c+'/'+id);
        likeRef2.once('value',function(snapshot){

          //如果有likes欄位->已經有人按讚、如果likes欄位有使用者的ID -> 已經按過讚了
          if(snapshot.child('like_user').exists() && snapshot.child('like_user').hasChild(user.uid)){
              heart.classList.add('likes-count'); //空心
              heart.classList.add('like-click'); //加上實心
                                           
          }else{
              
              heart.classList.add('likes-count');
                                       
          }
        }); 


        //連接使用者留言照片、留言網頁
        userRef.child(user.uid).once('value',function(snapshot){

         current_comment_user.style = 'visible';
         comment_input.style = 'visible';
         current_user_page.href = 'user.html?key='+user.uid;
         current_user_page.target="_blank";

         if(!snapshot.val().pic){

          current_comment_user.src = 'img/man.png';

         }else{

          current_comment_user.src = snapshot.val().pic;

         }

        });

      }else{ }


  });


            var uluru = {lat: lat, lng: lng};
            var map = new google.maps.Map(document.getElementById('GoogleMap'), {
                zoom: 18,
                center: uluru,
                styles: style

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
      

      document.querySelector('body').classList.add('loaded');             

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
        heart.addEventListener('click',function(event){
          
              event.preventDefault();

              heart.classList.toggle('like-click');
              var likes = like.innerHTML;
              var likeRef = firebase.database().ref('Post/'+c+'/'+id);

              likeRef.once('value',function(snapshot){

                var count = snapshot.val().like_count;
                
                //如果有likes欄位->已經有人按讚、如果likes欄位有使用者的ID -> 已經按過讚了
                if(snapshot.child('like_user').exists() && snapshot.child('like_user').hasChild(userid)){

                  postRef.child(c).child(id).child('like_user').child(userid).remove();
                  userRef.child(garyid).child('post').child(id).child('like_user').child(userid).remove();
                  count--;
                  postRef.child(c).child(id).child('like_count').set(count);
                  userRef.child(garyid).child('post').child(id).child('like_count').set(count);
                  toggle = false;

                                      
                }else{

                  postRef.child(c).child(id).child('like_user').child(userid).set(username);
                  userRef.child(garyid).child('post').child(id).child('like_user').child(userid).set(username);
                  count++;
                  postRef.child(c).child(id).child('like_count').set(count);
                  userRef.child(garyid).child('post').child(id).child('like_count').set(count);
                  toggle = true;
                  //gary
                  firebase.database().ref('users/'+garyid+'/notification').push({
                    type: "like",
                    article: value,
                    reader: user.displayName,
                    read: false,
                  });
                  //gary

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
            //gary
              firebase.database().ref('users/'+garyid+'/notification').push({
                type: "comment",
                article: value,
                reader: user.displayName,
                read: false,
              });
            //gary


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


            // var r = confirm("確定刪除？");

            // if (r==true){
            
             
                // postRef.child(c).child(id).remove();
                // userRef.child(userid).child('post').child(id).remove();
                // var commentRef = firebase.database().ref('Comment/'+id);
                // commentRef.remove();


            //     alert('文章已刪除');
            //     window.location.replace("/user.html");

            // }  

            swal({   

              title: "確定刪除文章?",   
              text: "文章刪除後無法復原",   
              type: "warning",   
              showCancelButton: true,   
              confirmButtonColor: "#DD6B55",   
              confirmButtonText: "好..刪好刪滿",   
              cancelButtonText: "不..讓我想想",   
              closeOnConfirm: false,   closeOnCancel: false }, 
              function(isConfirm){   
                if (isConfirm) {     
                  // swal({
                  //   title:"刪除完成!", 
                  //   text: "您的文章已被刪除", 
                  //   type: "success",
                  //   confirmButtonColor: "#0abab5" });   
                  postRef.child(c).child(id).remove();
                  userRef.child(userid).child('post').child(id).remove();
                  var commentRef = firebase.database().ref('Comment/'+id);
                  commentRef.remove();
                  window.location.replace("/user.html");
                } else {     
                  swal({
                    title: "取消刪除!", 
                    text: "您的文章安全了", 
                    type: "error",
                    confirmButtonColor: "#0abab5"
                  });   
                } });


        });


       
        //修改文章
        document.querySelector('#edit').addEventListener('click',function(){


            initMap2(lat,lng);

            var title = document.querySelector('#title');// <h2 id="title"></h2>
            like_div.style.display = 'none';//按讚區塊隱藏
            document.querySelector('#commentlist').style.display = 'none'; //留言列表
            document.querySelector('#commentuser').style.display = 'none'; //發表留言隱藏
            document.querySelector('#circle').style.display = 'none';
            //更換title -> input
            var input = document.createElement('input');//新增 <input>
            input.id = "input";//<input id="input">
            input.value = title.innerHTML;//title的文字讓他顯示在input中
            title.parentNode.insertBefore(input, title);//插入到title之前
            title.parentNode.removeChild(title);//刪除<h2 id="title"></h2>

            //更換content
            var content = document.querySelector('#content');
            var textarea = document.createElement('textarea');//新增 <textarea>
            textarea.rows = 20;//<textarea rows='20'>
            content.parentNode.insertBefore(textarea, content);//加在content前
            tinymce.init({
              selector: 'textarea',
              plugins: "textcolor",
              branding: false,
              toolbar: " undo redo | forecolor | backcolor | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |"
            });
            tinyMCE.activeEditor.setContent(content.innerHTML);
            content.parentNode.removeChild(content);

            //顯示 category
            select.style.display = "";
            type.style.display = "none";
            author.style.display = "none";
            date.style.display = "none";
            select_category.value = c;
               

            //顯示編輯照片
            document.querySelector('#edit_btn').style.display = '';


            //更換button
            document.querySelector('#done').style.display = 'inline'; //完成鈕顯示
            document.querySelector('#edit').style.display = 'none';  //編輯鈕隱藏

        });


          var uploadImage = document.querySelector('#file');
          var roundedImage = document.querySelector('#result');
          var cropimage = document.querySelector('#image');
          var button = document.querySelector('#button');
          var result = document.querySelector('#result');
  


          btn.addEventListener('click',function(){
                modal.style.display = "block";
          });
          span.onclick = function () {
                modal.style.display = "none";
          }
          


          uploadImage.addEventListener('change', function () {
            selectedFile = this.files[0]; 

            if (document.querySelector('.cropper-container') != null) {
                document.querySelector('.cropper-container').remove();
            }
            if (this.files && this.files[0]) {
                var reader = new FileReader();
                reader.onload = function (ev) {
                    var cropper = new Cropper(cropimage, {
                        aspectRatio: 16 / 9,
                    });
                    cropper.replace(ev.target.result);

                    button.onclick = function () {
                        var croppedCanvas;
                        // Crop
                        croppedCanvas = cropper.getCroppedCanvas();
                        // Show
                        roundedImage.src = croppedCanvas.toDataURL('image/png');
                        aimage.src = croppedCanvas.toDataURL('image/png');
                        
                    };
                }

                reader.readAsDataURL(this.files[0]);    
            }

        });






          //完成
          document.querySelector('#done').addEventListener('click',function(event){


                    event.preventDefault();
                    var ntitle = document.querySelector('#input').value;
                    console.log(ntitle);
                    var ncontent = tinyMCE.activeEditor.getContent();
                    var category = select_category.options[select_category.options.selectedIndex].value;
                    var d = new Date();
                    var month = d.getMonth()+1;
                    var dates = d.getFullYear()+"/"+month+"/"+d.getDate();
                    var timestamp = Math.floor(Date.now());

                  //確認是否填寫完畢(不完整)、會出現bug一直重複
                    if (!ntitle || !ncontent){

                        swal({

                          title: "標題 / 文章填寫不完整",
                          text: "請再檢查一次",
                          confirmButtonColor: "#0abab5",
                          confirmButtonText: '知道了'
                          

                        });

                    }else if (!roundedImage){

                        swal({

                          title: "照片還沒裁切",
                          confirmButtonColor: "#0abab5",
                          confirmButtonText: '知道了'

                        });

                        

                    }else{



                        var a = lat;
                        var b = lng;


                       if(!selectedFile){

                              if (category!=c){

                                if (!userlike){

                                  userlike = null;

                                } 

                                postRef.child(c).child(id).remove();
                                postRef.child(category).child(id).set({

                                     userid: uid,
                                     username: uname,
                                     title: ntitle,
                                     timestamp: timestamp,
                                     date: dates,
                                     lat: a,
                                     lng: b,
                                     p_content: ncontent, 
                                     p_photo:uphoto,
                                     like_count: ulike,
                                     like_user:  userlike,
                                     type: category

                                });

                                if (!userlike){

                                  userlike = null;

                                } 

                                userRef.child(userid).child('post').child(id).set({

                                     userid: uid,
                                     username: uname,
                                     title: ntitle,
                                     timestamp: timestamp,
                                     date: dates,
                                     lat: a,
                                     lng: b,
                                     p_content: ncontent, 
                                     p_photo:uphoto,
                                     like_count: ulike,
                                     like_user:  userlike,
                                     type: category


                                });
                                

                                c = category;

                                window.location.replace("/article.html?key="+id+"&Type="+c);


                              }else{


                                postRef.child(c).child(id).child('title').set(ntitle);
                                postRef.child(c).child(id).child('lat').set(a);
                                postRef.child(c).child(id).child('lng').set(b);
                                postRef.child(c).child(id).child('p_content').set(ncontent);
                                postRef.child(c).child(id).child('date').set(dates);
                                postRef.child(c).child(id).child('timestamp').set(timestamp);
                                postRef.child(c).child(id).child('type').set(c);
                               
                                userRef.child(userid).child('post').child(id).child('title').set(ntitle);
                                userRef.child(userid).child('post').child(id).child('lat').set(a);
                                userRef.child(userid).child('post').child(id).child('lng').set(b);
                                userRef.child(userid).child('post').child(id).child('p_content').set(ncontent);
                                userRef.child(userid).child('post').child(id).child('date').set(dates);
                                userRef.child(userid).child('post').child(id).child('timestamp').set(timestamp);
                                userRef.child(userid).child('post').child(id).child('type').set(c);

                                window.location.replace("/article.html?key="+id+"&Type="+c);

                              }

                                                        

                       }else{


                        var storageRef = firebase.storage().ref();    
                        var ranNum = Math.floor(Math.random() * 999999999);  
                        var uploadTask = storageRef.child('images/'+ ranNum +selectedFile.name).putString(roundedImage.src,'data_url');
                        uploadTask.on('state_changed', function(snapshot){
                     
                          }, function(error) {

                              alert('照片上傳失敗');

                          }, function() {

                              downloadURL = uploadTask.snapshot.downloadURL;

                              if (category!=c){

                                if (!userlike){

                                  userlike = null;

                                }

                                postRef.child(c).child(id).remove();
                                postRef.child(category).child(id).set({

                                     userid: uid,
                                     username: uname,
                                     title: ntitle,
                                     timestamp: timestamp,
                                     date: dates,
                                     lat: a,
                                     lng: b,
                                     p_content: ncontent,
                                     p_photo: downloadURL, 
                                     like_count: ulike,
                                     like_user:  userlike,
                                     type: category

                                });
                                
                                if (!userlike){

                                  userlike = null;

                                } 

                                 userRef.child(userid).child('post').child(id).set({

                                     userid: uid,
                                     username: uname,
                                     title: ntitle,
                                     timestamp: timestamp,
                                     date: dates,
                                     lat: a,
                                     lng: b,
                                     p_content: ncontent, 
                                     p_photo:uphoto,
                                     like_count: ulike,
                                     like_user:  userlike,
                                     type: category


                                });

                                c = category;

                                window.location.replace("/article.html?key="+id+"&Type="+c);


                              }else{


                                postRef.child(c).child(id).child('title').set(ntitle);
                                postRef.child(c).child(id).child('p_content').set(ncontent);
                                postRef.child(c).child(id).child('date').set(dates);
                                postRef.child(c).child(id).child('timestamp').set(timestamp);
                                postRef.child(c).child(id).child('type').set(c);
                                postRef.child(c).child(id).child('p_photo').set(downloadURL);
                                postRef.child(c).child(id).child('lat').set(a);
                                postRef.child(c).child(id).child('lng').set(b);

                                userRef.child(userid).child('post').child(id).child('title').set(ntitle);
                                userRef.child(userid).child('post').child(id).child('lat').set(a);
                                userRef.child(userid).child('post').child(id).child('lng').set(b);
                                userRef.child(userid).child('post').child(id).child('p_content').set(ncontent);
                                userRef.child(userid).child('post').child(id).child('date').set(dates);
                                userRef.child(userid).child('post').child(id).child('timestamp').set(timestamp);
                                userRef.child(userid).child('post').child(id).child('type').set(c);
                                userRef.child(userid).child('post').child(id).child('p_photo').set(downloadURL);

                                window.location.replace("/article.html?key="+id+"&Type="+c);


                              }

                                                          
                          });


                       }

                       
                    }



            });
            


     } else {
                      
          user = null;
          //alert ('您尚未登入');                
      }


      var commentsRef = firebase.database().ref('Comment/'+value);
      commentsRef.on('child_added', function(snap) {
      document.querySelector('#commentlist').innerHTML += commentHtmlFromObject(snap.val());    
      });  



 });





 //新增留言架構
 function commentHtmlFromObject(commentlist){

       var html = '';
        html += '<hr>';
          html += '<div class="comment-container">';
           html += '<div class="user-pic">';
            html += '<a href="user.html?key='+commentlist.userid+'" target="_blank">';
            html += '<img src="'+commentlist.photo_url+'">';
            html += '</a>';
             html += '</div>';
          html += '<div class="user-comment">';
        html += '<div><a href="user.html?key='+commentlist.userid+'"  target="_blank">'+commentlist.username+'</a></div>';
        html += '<div>'+commentlist.c_content+'</div>';
        html += '<div><p align="right">'+commentlist.date+'</p></div>';
        html += '</div>';
        html += '</div>';
        return html;

 }










 function initMap2(lat,lng) {

    myLatlng = new google.maps.LatLng(lat,lng);
    var map = new google.maps.Map(document.getElementById('GoogleMap'), {
        zoom: 15,
        center: myLatlng,
        styles: style
        // zoomControl: false,
        // mapTypeControl: false,
        // streetViewControl: false

    });

    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(gps);
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(input);

    //marker icon resize
    var icon = {
    url: 'img/placeholder.png', // url
    scaledSize: new google.maps.Size(50, 50), // scaled size
    };

    marker = new google.maps.Marker({

        position: myLatlng,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: icon

    });

    lat = myLatlng.lat();
    lng = myLatlng.lng();


    map.setOptions({
        minZoom: 3,
        maxZoom: 20
    });

    map.addListener('click', function (e) {
        placeMarker(e.latLng, map);
    });


    //Bias the search result to Taiwan
    var defaultBounds = new google.maps.LatLngBounds(

        new google.maps.LatLng(22, 120.13),
        new google.maps.LatLng(25.1, 121.45));

    var options = {
        bounds: defaultBounds
    };


    //Create autocomplete object 
    var autocomplete = new google.maps.places.Autocomplete(input, options);

    //Keycode 
    google.maps.event.addDomListener(input, 'keydown', function (e) {
        console.log(e.triggered)
        if (e.keyCode === 13 && !e.triggered) {
            google.maps.event.trigger(this, 'keydown', {
                keyCode: 40
            })
            google.maps.event.trigger(this, 'keydown', {
                keyCode: 13,
                triggered: true
            })
        }
    });

    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        place = autocomplete.getPlace();

        if (!place.geometry) {

          //alert

        } else {

            center = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
            map.panTo(center);
            map.setZoom(18);
            placeMarker(center, map);

        }

    });


    gps.onclick = function () {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                console.log(pos);
                map.setCenter(pos);
                map.setZoom(18);
                placeMarker(pos, map);
            }, function () {
                handleLocationError(true, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, map.getCenter());
        }
    }

}



//更換Marker位置
function placeMarker(latLng, map) {

    marker.setPosition(latLng);
    lat = latLng.lat();
    lng = latLng.lng();
    

}


function handleLocationError(browserHasGeolocation, pos) {
    // infoWindow.setPosition(pos);
    // infoWindow.setContent(browserHasGeolocation ?
    //                     'Error: The Geolocation service failed.' :
    //                      'Error: Your browser doesn\'t support geolocation.');

}