const baseContainer = document.getElementById("baseContainer");

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

function incrementScore() {
    score += 1;

    if (score === 5) {
        environment.changeAmbientColor("hell")
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

    player.resetPlayerData()

    player.highScore = Math.max(player.highScore, score);

    environment.changeAmbientColor("default")

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
    Environment.preload()
    Player.preload()
    Obstacle.preload()
    BlackHole.preload()
    DeadTree.preload()
    gamePreload()
}

function getPlatformExactY() {
    return height - environment.platformHeight - player.playerData.height;
}

// p5.js setup function
function setup() {

    // Hide loading texts
    baseContainer.style.display = "none";

    // screen-sized

    createCanvas(windowWidth, windowHeight);

    angleMode(DEGREES);
    frameRate(60)

    environment = new Environment(50);

    blackHole = new BlackHole();

    player = new Player();
    player.init(environment)

    generatePiles(4000 + (Math.random() * 500), 5)

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

    if (environment.currentAmbiance === "hell") {
        environment.drawVignette();
    }

}


// Helper function to draw the environment
function drawEnvironment() {
    environment.drawAmbiance();
}

// Helper function to display the score and instructions
function displayScoreAndInstructions() {
    push();
    fill(environment.textColorPrimary);
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

        text(`Highscore: ${player.highScore}`, width / 2, height * 0.74);

        if (score < 5) {
            // Hell is coming text
            textSize(width / 54);
            text(`HELL is coming... ${score-5}`, width / 2, height * 0.8);
        }

    } else {
        text(`Highscore: ${player.highScore}`, width / 2, height * 0.6);

        if (score < 5) {
            // Hell is coming text
            textSize(width / 54);
            text(`HELL is coming... ${score-5}`, width / 2, height * 0.66);
        }
    }



    pop();
}

// Helper function to display the controls
function displayControls() {
    push();
    textAlign(LEFT);
    textFont(minecraftFont);
    textSize(width / 54);
    fill(environment.textColorSecondary);

    // Display control instructions
    const controls = [
        { text: "Jump: Space", y: 0.17 },
        { text: "Move Back: Key [A]", y: 0.22 },
        { text: "Move Forward: Key [D]", y: 0.27 },
        { text: "Pause: Key [P]", y: 0.32 },
        { text: "Toggle Mute: Key [M]", y: 0.37 }
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
        loop();
    }
}