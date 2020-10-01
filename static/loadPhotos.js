function updatePhotoFrame(frameNumber){

    var imageFrame = document.getElementById("photoFrame"+frameNumber);
    imageFrame.src = '';
    imageFrame.src = './newPic?'+ new Date().getTime();//Forces a reload of the new picture

}

function hideForegroundPhotoFrame(){
    
    var imageFrame = document.getElementById("photoFrameForeground");

    className = "hiddenPhotoFrame"
    if(imageFrame.classList.contains(className)){
        imageFrame.classList.remove(className)
    }else{
        imageFrame.classList.add(className)
    }

}


function nonVisiblePhotoFrame(){
    if(currentPhotoFrame == 1){
        return 2
    }
    else{
        return 1
    }
}

function showNextImage(loadTimeout=2000){
    console.log('showNextImage')
    hideForegroundPhotoFrame();
    currentPhotoFrame = nonVisiblePhotoFrame();
    
    // Foreground takes 2s to hide, so need to reload AFTER that.
    return setTimeout(loadImageIntoFrame, loadTimeout);
}

function loadImageIntoFrame(){
    console.log("loading new ImageIntoFrame");

    updatePhotoFrame(nonVisiblePhotoFrame())

    // Wait for the background of the other to actually load - other it will load and pop halfway through the fade-transition
    currentTransitionTimeout = setTimeout(showNextImage, waitForLoadMs);

    refreshCount+=1;
    if(refreshCount >= reloadPageAfterThisManyImages){
        console.log("refreshCount=", refreshCount, " reloadPageAfterThisManyImages: ", reloadPageAfterThisManyImages);
        location.reload();
    }
}

// Doesn't work as you need to wait for the transition to end before clicking again
function forceNewPicture1(){
    clearTimeout(currentTransitionTimeout)
    currentTransitionTimeout = showNextImage();
}

// Doesn't work as the foreground image flashes the new image as it's fading out.
function forceNewPicture2(){
    clearTimeout(currentTransitionTimeout)
    currentTransitionTimeout = showNextImage(0);
}

function forceNewPicture(){
    clearTimeout(currentTransitionTimeout)
    updatePhotoFrame(currentPhotoFrame)
    currentTransitionTimeout = setTimeout(showNextImage, waitForLoadMs);
}

function openFullscreen(){

    var elem = document.getElementById("photoframe_container"); 

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
    else if (elem.webkitEnterFullScreen) {
        elem.webkitEnterFullScreen();
    }   
    
}

// https://davidwalsh.name/query-string-javascript
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};


var currentPhotoFrame = 2;
var waitForLoadMs = 3  *1000;

var refreshCount = 0; 
//reload the page after this many files so that the browser can cleanup  memory.
var reloadPageAfterThisManyImages = getUrlParameter('light') || 20;
    console.log("reloadPageAfterThisManyImages: ", reloadPageAfterThisManyImages)


var currentTransitionTimeout;
// Will recursively call itself.
loadImageIntoFrame();

document.body.onclick = forceNewPicture;
