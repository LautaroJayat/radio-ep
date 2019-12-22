var binaryData;
let previewImage;
const close = document.getElementById('close');
const croppNow = document.getElementById('croppNow');
const urlInput = document.getElementById('urlInput');
const selectUrl = document.getElementById('selectUrl');
const cancelUrl = document.getElementById('cancelUrl');
const urlPrompt = document.getElementById('urlPrompt');
const image = document.getElementById('image');
const fileInput = document.getElementById('fileInput');
const imageFromFile = document.getElementById('getFileInput');
const imageFromUrl = document.getElementById('addImageFromUrl');


//  Opening the file input using just a button (File Input is Hidden in background)
imageFromFile.addEventListener('click', function () {
    fileInput.click();
});

// Triggering the file reader and the canvas once the File Input has changed
fileInput.addEventListener('change', function () {
    const reader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.onload = function (e) {
        cropper.replace(e.target.result);
    }
})

// Changing the position of the URL promt that is outside the screen
imageFromUrl.addEventListener('click', function () {
    urlPrompt.style.left = '29vw';
});

// Moving the Cropper 1000% to the right so it appears that has been removed
cancelUrl.addEventListener('click', function () {
    urlPrompt.style.left = '1000%';
});

// Triggering the cropper and pushing the URL prompt to the right so it appears to be removed
selectUrl.addEventListener('click', function () {
    urlPrompt.style.left = '1000%';
    cropper.replace(urlInput.value);
});

// Destroying and the cropper and pushing the controls to the background
close.addEventListener('click', function () {
    if (cropper) {
        cropper.destroy();
    }
    document.getElementById('cropper-div').style.left = '1000%';

});

// Setting the Crop Operations in the Event Listener
croppNow.addEventListener('click', canvasToBlob);

// Converting the Canvas into a blob
function canvasToBlob() {
    let canvas = cropper.getCroppedCanvas();
    previewImage = canvas.toDataURL();
    canvas.toBlob((blob) => { binaryData = blob; console.log("big img", binaryData) }, 'image/jpeg');
    //  If we allready have an image preview, we just change the SRC
    if (document.getElementById('preview-image')) {
        document.getElementById('preview-image').src = previewImage;
        // If we dont have the image preview, we just create one and add a class
    } else {
        const imgURLObject = document.createElement('img');
        imgURLObject.src = previewImage;
        imgURLObject.id = 'preview-image';
        document.getElementById("img-preview-container").appendChild(imgURLObject);
        imgURLObject.classList.add('img-prev');
    }
    // Then we push the cropper to the background
    document.getElementById('cropper-div').style.left = '1000%';

}

// Creatting the Cropper instance 
const cropper = new Cropper(image, {
    aspectRatio: CROPPER_RATIO,
    preview: '.img-preview'
});

