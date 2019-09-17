var front = false;
var constraints = { video: { facingMode: (front? "user" : "environment") } };
navigator.mediaDevices.getUserMedia(constraints)
    .then(function success(stream) {
        var video = document.querySelector('video');
        if ("srcObject" in video) {
            video.srcObject = stream;
        } //else {
        //video.src = window.URL.createObjectURL(stream);
        //}
        video.setAttribute('autoplay', '');
        video.setAttribute('muted', '');
        video.setAttribute('playsinline', '');
        video.onloadedmetadata = function(e) {
            video.play();
        };
    })
    .catch(function(err) {
        console.log(err.name + ": " + err.message);
    });
