
let pressedKeys = [];
let obstaclePiles = [];
let points = 0;

let player;
let environment;

function drawPiles() {
    for (let pile of obstaclePiles) {
        pile.draw();
    }
}

function generatePiles(rate, baseSpeed, min = 1, max = 3) {
    return setInterval(() => {
        let amount = getRandomInt(min, max);
        let pile = new ObstaclePile();
        pile.generate(amount, baseSpeed + points * 0.5);
        obstaclePiles.push(pile);
    }, rate);
}

function destroyPiles() {
    obstaclePiles = [];
}

function lose() {
    destroyPiles()

    points = 0;
}

function gamePreload() {
    minecraftFont = loadFont('static/assets/font/Minecraft.ttf');
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    player.setOnPlatform();
    destroyPiles();

    points = 0;
}

// p5.js preload function
function preload() {
    Player.preload()
    Obstacle.preload()
    gamePreload()
}

// p5.js setup function
function setup() {

    // screen-sized

    createCanvas(windowWidth, windowHeight);

    angleMode(DEGREES);
    frameRate(60)

    environment = new Environment(50);

    //registerListeners();

    player = new Player();
    player.init(environment)

    generatePiles(4000 + (Math.random() * 500), 5)

}


// p5.js draw function
function draw() {

    environment.drawBackground()
    environment.drawPlatform();

    push()
    fill(105, 78, 42)

    textAlign(CENTER);
    textSize(width / 8);
    textFont(minecraftFont)
    text(points, width / 2, height / 2)

    if (!player.moved) {
        textSize(width / 54);
        // text("Highscore: " + highscore, width / 2, height / 2 + 100)
        text("How to play:", width / 2, height * 0.6)
        text("Jump: Space", width / 2, height * 0.64)
        text("A - D: Back, Forward", width / 2, height * 0.68)
        //text("Pause: P", width / 2, height / 2 + 250)
    }

    pop()

    player.draw()

    drawPiles()

}