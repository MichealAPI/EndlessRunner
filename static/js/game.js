
let pressedKeys = [];
let obstaclePiles = [];
let points = 0;

function registerListeners() {

    // A to go back
    // D to go forward

    document.addEventListener('keydown', (event) => {
        pressedKeys.push(event.key);

    });

    document.addEventListener('keyup', (event) => {
        pressedKeys = pressedKeys.filter((key) => key !== event.key);
    });

}

function keyIsDown(key) {
    return pressedKeys[key];
}


function drawPiles() {
    for (let pile of obstaclePiles) {
        pile.draw();
    }
}

function generatePiles(rate, speed, min = 1, max = 3) {
    return setInterval(() => {
        let amount = getRandomInt(min, max);
        let pile = new ObstaclePile();
        pile.generate(amount, speed);
        obstaclePiles.push(pile);
    }, rate);
}

function destroyPiles() {
    obstaclePiles = [];
}

function lose() {
    destroyPiles()
}

function gamePreload() {
    minecraftFont = loadFont('static/assets/font/Minecraft.ttf');
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}