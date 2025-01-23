
let muted = false

function playSound(sound) {

    if(muted) return;

    var audio = new Audio(sound);
    audio.volume = 0.7;
    audio.play();
}

function playJumpSound() {
    playSound('static/assets/sound/jump.mp3');
}

function playPointSound() {
    playSound('static/assets/sound/point.mp3');
}

function playLostSound() {
    playSound('static/assets/sound/lost.mp3');
}

function toggleSound() {
    muted = !muted;
    document.querySelectorAll('audio').forEach(audio => {
        audio.muted = muted;
    });
}