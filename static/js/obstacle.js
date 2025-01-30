class Obstacle {

    static OBSTACLE_SIZE = 100;
    static DEFAULT_IMAGES = [];

    currentImage = Obstacle.DEFAULT_IMAGES[getRandomInt(0, Obstacle.DEFAULT_IMAGES.length - 1)];

    x
    y
    speed

    playerHeight

    constructor(relativeX, relativeY, speed) {
        this.x = relativeX;
        this.y = relativeY;
        this.speed = speed

        this.playerHeight = Math.abs(Player.DEFAULT_STATE_IMG.height);

        this.size = Obstacle.OBSTACLE_SIZE;
        this.opacity = 255;
    }

    hasCollided() {
        return this.x < player.x + player.playerData.width &&
            this.x + this.size > player.x &&
            this.y < player.y + player.playerData.height &&
            this.y + this.size > player.y;
    }

    move() {

        this.x -= this.speed;

    }

    draw() {

        push()

        // Opacity
        tint(255, this.opacity);

        image(
            this.currentImage,
            this.x,
            this.y,
            this.size,
            this.size
        );

        pop();
    }

    static preload() {
        Obstacle.DEFAULT_IMAGES.push(loadImage('static/assets/ball_of_wool.png'));
        Obstacle.DEFAULT_IMAGES.push(loadImage('static/assets/wooden_box.png'));
    }

}


class ObstaclePile {

    obstacles = []
    pileHeight = 0


    generate(obstaclesAmount = 1, linearSpeed = 1) {
        for (let i = 0; i < obstaclesAmount; i++) {
            this.createObstacle(linearSpeed);
        }

        // sort obstacles by y position
        this.obstacles.sort((a, b) => a.y - b.y);
    }

    draw() {

        for (let obstacle of this.obstacles) {

            if (blackHole.hasCollided(obstacle.x, obstacle.y)) {

                obstacle.y -= .4;
                obstacle.size -= .4;
                obstacle.opacity -= 5;

                if (obstacle.y >= blackHole.blackHoleSize / 2 && obstacle.x >= blackHole.x && obstacle.x <= blackHole.x + (blackHole.blackHoleSize / 2)) {
                    this.obstacles.splice(this.obstacles.indexOf(obstacle), 1);
                    incrementScore()
                    playPointSound();

                    continue;
                }
            }

            obstacle.move();

        }

        const topObstacle = this.obstacles[0];

        // Predict collision
        let predictionResult = this.predictCollision();

        if (predictionResult) {


            if(predictionResult === "top") {


                this.firstTouchEvent();

                // Stick to platform vertically
                player.y = Math.round(topObstacle.y) - player.playerData.height;

            } else if (predictionResult === "left" && !player.onPlatform) {
                player.x -= topObstacle.speed;
                player.sideCollision = true;
            } else if (predictionResult === "internal") {
                player.x = topObstacle.x - player.playerData.width;
            }

        } else {
            player.onPlatform = false;
            player.sideCollision = false;
        }

        if(player.onPlatform && topObstacle) {
            player.x -= topObstacle.speed;
        }

        for (let obstacle of this.obstacles) {
            obstacle.draw();
        }

    }

    predictCollision() {
        let topObstacle = this.obstacles[0];

        if (!topObstacle) return;

        // Define the bounding boxes based on the topObstacle
        let topBound = {
            x: topObstacle.x,
            y: topObstacle.y - 10, // Slightly above the top of the obstacle
            width: topObstacle.size,
            height: 10
        };

        let leftBound = {
            x: topObstacle.x - 5,
            y: height - environment.platformHeight - this.pileHeight,
            width: 5,
            height: this.pileHeight
        };

        let internalBound = {
            x: topObstacle.x + 5,
            y: topObstacle.y,
            width: topObstacle.size - 5,
            height: this.pileHeight
        };

        // Predict collisions with the player
        let leftCollision = this.predictCollisionWithBoundBox(player, leftBound);
        let topCollision = this.predictCollisionWithBoundBox(player, topBound);
        let internalCollision = this.predictCollisionWithBoundBox(player, internalBound);

        // Draw debug bounding boxes
        //this.drawDebugBoundBox(leftBound);
        //this.drawDebugBoundBox(topBound);
        //this.drawDebugBoundBox(internalBound);

        return leftCollision ? "left" : topCollision ? "top" : internalCollision ? "internal" : false;
    }

    firstTouchEvent() {

        if (!player.onPlatform) {

            player.isJumping = false;
            player.onPlatform = true;

        }

    }

    drawDebugBoundBox(boundBox) {
        push();
        noFill();
        stroke(255, 0, 0);
        rect(boundBox.x, boundBox.y, boundBox.width, boundBox.height);
        pop();
    }

    predictCollisionWithBoundBox(player, boundBox) {

        // x, y, width, height
        return player.x < boundBox.x + boundBox.width &&
            player.x + player.playerData.width > boundBox.x &&
            player.y < boundBox.y + boundBox.height &&
            player.y + player.playerData.height > boundBox.y;

    }

    addObstacle(obstacle) {
        this.obstacles.push(obstacle);
        this.pileHeight += obstacle.size;
    }

    createObstacle(speed) {
        // Position the new obstacle based on pileHeight
        let y = height - environment.platformHeight - this.pileHeight - Obstacle.OBSTACLE_SIZE;
        let x = width - Obstacle.OBSTACLE_SIZE; // Position near the right side of the screen

        this.addObstacle(new Obstacle(x, y, speed));
    }

}