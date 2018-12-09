var current = null; 
document.addEventListener("keypress", function(event) {
    if (current) {
        current.pause();
        current.currentTime = 0;
    } 
    current = document.querySelector('[data-key="' + event.keyCode + '"]');
    current.play();
})
