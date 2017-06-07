var uploadImage = document.querySelector('input[type=file]');
var roundedImage= document.querySelector('#result');
var image = document.querySelector('#image');
var button =document.querySelector('#button');
var result = document.querySelector('#result');

uploadImage.addEventListener('change', function () {
    if (this.files && this.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            image.src = e.target.result;
            var cropper = new Cropper(image, {
                aspectRatio: 16 / 9,
                crop: function (e) {
                    console.log(e.detail.x);
                    console.log(e.detail.y);
                    console.log(e.detail.width);
                    console.log(e.detail.height);
                    console.log(e.detail.rotate);
                    console.log(e.detail.scaleX);
                    console.log(e.detail.scaleY);
                }
            });
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
})