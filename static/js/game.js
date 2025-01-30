let obstaclePiles = [];
let score = 0;

let player;
let environment;
let pileInterval;

let blackHole;

function drawPiles() {
    for (let pile of obstaclePiles) {
        pile.draw();
    }
}


function generatePiles(rate, baseSpeed, min = 1, max = 3) {
    function createPiles() {
        let amount = getRandomInt(min, max);
        let pile = new ObstaclePile();
        pile.generate(amount, baseSpeed + score * 0.5);
        obstaclePiles.push(pile);

        rate = Math.random() * 3000 + 1000

        generatePiles(rate, baseSpeed, min, max);
    }

    pileInterval = setTimeout(createPiles, rate);
}

function destroyPiles() {
    obstaclePiles = [];
}

function lose() {
    destroyPiles()
    playLostSound();
    player.freeze = false;
    player.opacity = 255;
    player.setOnPlatform();

    player.highScore = Math.max(player.highScore, score);

    score = 0;
}

function gamePreload() {
    minecraftFont = loadFont('static/assets/font/Minecraft.ttf');
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// p5.js windowResized function
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    lose()
}

// p5.js preload function
function preload() {
    Player.preload()
    Obstacle.preload()
    BlackHole.preload()
    gamePreload()
}

function getPlatformExactY() {
    return height - environment.platformHeight - player.playerData.height;
}

// p5.js setup function
function setup() {

    // screen-sized

    createCanvas(windowWidth, windowHeight);
    collideDebug(true);


    angleMode(DEGREES);
    frameRate(60)

    environment = new Environment(50);

    //registerListeners();

    blackHole = new BlackHole();

    player = new Player();
    player.init(environment)

    generatePiles(4000 + (Math.random() * 500), 5)

    console.log(environment.platformHeight)

}


// p5.js draw function
function draw() {


    // Draw the environment
    drawEnvironment();

    // Display the score and instructions
    displayScoreAndInstructions();

    // Display the controls
    displayControls();

    blackHole.draw();

    // Draw player and piles
    player.draw();


    drawPiles();

}


// Helper function to draw the environment
function drawEnvironment() {
    environment.drawBackground();
    environment.drawPlatform();
}

// Helper function to display the score and instructions
function displayScoreAndInstructions() {
    push();
    fill(105, 78, 42);
    textAlign(CENTER);
    textFont(minecraftFont);

    // Display the score
    textSize(width / 8);
    text(score, width / 2, height / 2);

    // Display instructions based on the score
    textSize(width / 54);
    if (score <= 0) {
        text("How to play:", width / 2, height * 0.6);
        text("Jump over the obstacles by pressing the spacebar", width / 2, height * 0.64);
        text ("Avoid the black hole!", width / 2, height * 0.68);

        text("Highscore: " + player.highScore, width / 2, height * 0.74);
    } else {
        text("Highscore: " + player.highScore, width / 2, height * 0.6);
    }
    pop();
}

// Helper function to display the controls
function displayControls() {
    push();
    textAlign(LEFT);
    textFont(minecraftFont);
    textSize(width / 54);
    fill(177, 132, 23);

    // Display control instructions
    const controls = [
        { text: "Jump: Space", y: 0.1 },
        { text: "Move Back: Key [A]", y: 0.15 },
        { text: "Move Forward: Key [D]", y: 0.2 },
        { text: "Pause: Key [P]", y: 0.25 },
        { text: "Toggle Mute: Key [M]", y: 0.3 }
    ];

    controls.forEach(control => {
        text(control.text, 100, height * control.y);
    });
    pop();
}



function togglePause() {
    this.paused = !this.paused;
    toggleSound()

    if(this.paused) {
        noLoop();
    } else {
        console.log("Resuming game")
        loop();
    }
}