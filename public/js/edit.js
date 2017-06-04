var uploadImage = document.querySelector('input[type=file]');
var roundedImage= document.querySelector('#result');
var image = document.querySelector('#image');
var button =document.querySelector('#button');
var result = document.querySelector('#result');

uploadImage.addEventListener('change', function () {
    if(document.querySelector('.cropper-container')!=null){
        document.querySelector('.cropper-container').remove();
    }
    if (this.files && this.files[0]) {
        var reader = new FileReader();

        reader.onload = function (ev) {
            var cropper = new Cropper(image, {
                aspectRatio: 16 / 9,
                // crop: function (e) {
                //     // console.log(e.detail.x);
                //     // console.log(e.detail.y);
                //     // console.log(e.detail.width);
                //     // console.log(e.detail.height);
                //     // console.log(e.detail.rotate);
                //     // console.log(e.detail.scaleX);
                //     // console.log(e.detail.scaleY);
                // }
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

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// }