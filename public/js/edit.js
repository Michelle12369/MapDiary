var uploadImage = document.querySelector('#file');
var roundedImage = document.querySelector('#result');
var image = document.querySelector('#image');
var button = document.querySelector('#button');
var result = document.querySelector('#result');
var gps = document.querySelector('#gps');
var input = document.querySelector('#pac-input');
var selectedFile;



// by chien
uploadImage.addEventListener('change', function () {

    selectedFile = this.files[0]; 

    if (document.querySelector('.cropper-container') != null) {
        document.querySelector('.cropper-container').remove();
    }
    if (this.files && this.files[0]) {
        var reader = new FileReader();
        reader.onload = function (ev) {
            var cropper = new Cropper(image, {
                aspectRatio: 16 / 9,
            });
            cropper.replace(ev.target.result);

            button.onclick = function () {
                var croppedCanvas;
                // Crop
                croppedCanvas = cropper.getCroppedCanvas();
                // Show
                roundedImage.src = croppedCanvas.toDataURL('image/png');
                
            };
        }

        reader.readAsDataURL(this.files[0]);    
    }

});


var modal = document.getElementById('myModal');
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function () {
    modal.style.display = "block";
}
span.onclick = function () {
    modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// }


//by shao
//Jun 1st 修改
var database = firebase.database();
var submit = document.querySelector('#submit');
var selectbox = document.querySelector('#category_select');
var myLatlng = "";
var marker, lat, lng;


/*問題: 讓文字視窗先不要顯示、上傳成功後顯示success、如果沒有選擇圖片、重新整理*/
/*問題: storage 建置 （要不要以post id 將照片取名、或是以使用者ID）*/

submit.addEventListener('click', function () {

        var title = document.querySelector('#title').value;
        var category = selectbox.options[selectbox.options.selectedIndex].value;
        var p_content = tinyMCE.get('p_content').getContent();
        var downloadURL;


        if (!title || !p_content) { 

            alert( "沒有填寫完整" ); 


        }else if (!selectedFile){

            alert("您尚未選擇圖片");

        }else if (!roundedImage)

            alert("您尚未裁切圖片");

        else{

            var storageRef = firebase.storage().ref();    
            var ranNum = Math.floor(Math.random() * 999999999);  
            var uploadTask = storageRef.child('images/'+ ranNum +selectedFile.name).putString(roundedImage.src,'data_url');
            uploadTask.on('state_changed', function(snapshot){
         
        }, function(error) {

            alert('照片上傳失敗');

        }, function() {

            downloadURL = uploadTask.snapshot.downloadURL;
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    //console.log("signin");
                    //console.log(user);
                    uploadPost(title,category,p_content,downloadURL,user.uid,user.displayName);  


                } else {
                    user = null;
                    console.log("User is not logined yet.");
                }
            });
        });

        }           
       
             
});


function uploadPost(title, category, p_content, downloadURL,email,name) {

        var d = new Date();
        var month = d.getMonth()+1;
        var date = d.getFullYear()+"/"+month+"/"+d.getDate();
        var timestamp = Math.floor(Date.now());
      

       // console.log(email);
        var newPost = firebase.database().ref('Post/' + category).push({
            userid: email,
            username: name,
            title: title,
            timestamp: timestamp,
            date: date,
            lat: lat,
            lng: lng,
            p_content: p_content,
            p_photo: downloadURL, 
            like_count: 0,
        });

        var postId = newPost.getKey();

        alert('上傳成功');
        window.location.reload();
}




function initMap() {

    myLatlng = new google.maps.LatLng(24.987516, 121.57607400000006);
    var map = new google.maps.Map(document.getElementById('pickmap'), {
        zoom: 15,
        center: myLatlng,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false
    });

    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(gps);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

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

    // var input = document.createElement("input");
    // input.id = "pac-input";
    // input.className = "controls";
    // input.type = "text";
    // input.placeholder = "Search";
    // input.parentNode.insertBefore(gps,input);


    // Geolocation 
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(function(position) {
    //     var pos = {
    //       lat: position.coords.latitude,
    //       lng: position.coords.longitude
    //     };

    //     map.setCenter(pos);
    //       marker = new google.maps.Marker({
    //       position: pos,
    //       map: map,
    //     });

    //     lat = position.coords.latitude;
    //     lng = position.coords.longitude;

    //   }, function() {
    //     handleLocationError(true, map.getCenter());
    //   });
    // } else {
    //   // Browser doesn't support Geolocation
    //   handleLocationError(false, map.getCenter());
    // }


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

            alert("請填寫正確位址");

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
    console.log(lat + "," + lng)

}


function handleLocationError(browserHasGeolocation, pos) {
    // infoWindow.setPosition(pos);
    // infoWindow.setContent(browserHasGeolocation ?
    //                     'Error: The Geolocation service failed.' :
    //                      'Error: Your browser doesn\'t support geolocation.');

}












