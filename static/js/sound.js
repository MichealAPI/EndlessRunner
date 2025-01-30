
let muted = false
let baseAudio = new Audio('static/assets/sound/game-loop.mp3');

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

function playThunder() {
    playSound('static/assets/sound/thunder.mp3');
}

function playBaseSongLoop() {
    baseAudio.loop = true;
    baseAudio.volume = 0.5;
    baseAudio.play();
}

function stopBaseSongLoop() {
    baseAudio.pause();
}

function toggleSound() {
    muted = !muted;
    if(muted) {
        baseAudio.pause();
    } else {
        baseAudio.play();
    }
}
