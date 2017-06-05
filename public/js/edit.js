var uploadImage = document.querySelector('#file');
var roundedImage = document.querySelector('#result');
var image = document.querySelector('#image');
var button = document.querySelector('#button');
var result = document.querySelector('#result');
var gps = document.querySelector('#gps');
var input = document.querySelector('#pac-input');




var file = document.getElementById("file");
var submit = document.getElementById("submit");
var selectedFile;



// by chien
uploadImage.addEventListener('change', function () {

    
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
        selectedFile = this.files[0]; 

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
//var submit = document.querySelector('#submit');
var selectbox = document.querySelector('#category_select');
var userid = 'joy_shao37';
var myLatlng = "";
var marker, lat, lng;


/*問題: marker會有重複的情況再檢查、reloading page more than twice will cause error*/

submit.addEventListener('click', function () {

        // var title = document.querySelector('#title').value;
        // var category = selectbox.options[selectbox.options.selectedIndex].value;
        // var p_content = tinyMCE.get('p_content').getContent();

        

        var storageRef = firebase.storage().ref();
        var uploadTask = storageRef.child(selectedFile.name).put(selectedFile);
        uploadTask.on('state_changed', null, null, function() {
            var downloadURL = uploadTask.snapshot.downloadURL;
        });
  
        /*if-else判斷有沒有填寫完整*/
        //uploadPost(title,category,p_content);
       

})


function uploadPost(title, category, p_content) {

    firebase.database().ref('Post/' + category).push().set({
        userid: userid,
        title: title,
        lat: lat,
        lng: lng,
        p_content: p_content,
        //p_photo:    
        like_count: 0,
        like_user: ""
    });
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


    marker = new google.maps.Marker({

        position: myLatlng,
        map: map,

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


    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(gps);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    gps.onclick = function () {

        // var infoWindow = new google.maps.InfoWindow({map: map});

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
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

