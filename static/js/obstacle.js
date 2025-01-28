class Obstacle {

    static OBSTACLE_SIZE = 100;
    static DEFAULT_IMAGES = [];

    currentImage = Obstacle.DEFAULT_IMAGES[getRandomInt(0, Obstacle.DEFAULT_IMAGES.length - 1)];

    x
    y
    speed

    constructor(relativeX, relativeY, speed) {
        this.x = width - relativeX;
        this.y = height - environment.platformHeight - relativeY - Obstacle.OBSTACLE_SIZE;
        this.speed = speed

        this.size = Obstacle.OBSTACLE_SIZE;
        this.opacity = 255;
    }

    hasCollided() {
        return this.x < player.x + player.playerData.width &&
            this.x + this.size > player.x &&
            this.y < player.y + player.playerData.width &&
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
    }

    draw() {

        for (let obstacle of this.obstacles) {

            if (blackHole.hasCollided(obstacle.x, obstacle.y)) {

                obstacle.y -= .4;
                obstacle.size -= .4;
                obstacle.opacity -= 5;

                if (obstacle.y >= blackHole.blackHoleSize / 2 && obstacle.x >= blackHole.x && obstacle.x <= blackHole.x + (blackHole.blackHoleSize / 2)) {
                    this.obstacles.splice(this.obstacles.indexOf(obstacle), 1);
                    score += 1;
                    playPointSound();

                    continue;
                }
            }

            // Predict collision
            let predictionResult = this.predictCollision();

            if (predictionResult) {

                const topObstacle = this.obstacles.reduce((top, obs) => obs.y < top.y ? obs : top, this.obstacles[0]);

                if (predictionResult === "left") {
                    player.x -= topObstacle.speed;
                } else if (predictionResult === "top") {
                    player.y = topObstacle.y - topObstacle.size;
                }

            }


            obstacle.move()

            //obstacle.move();
            obstacle.draw();

        }

    }

    predictCollision() {

        // Define left bound box

        const topObstacle = this.obstacles.reduce((top, obs) => obs.y < top.y ? obs : top, this.obstacles[0]);

        if (!topObstacle) return;

        let pileTop = topObstacle.y - topObstacle.size;

        // Define top bound box

        let topObstacleX = topObstacle.x;
        let topObstacleY = topObstacle.y;

        let topBound = {
            x: topObstacle.x,
            y: topObstacleY - topObstacle.size,
            width: topObstacle.size,
            height: 20
        }

        let leftBound = {
            x: topObstacle.x,
            y: height - environment.platformHeight - this.pileHeight,
            width: 25,
            height: pileTop + topBound.height
        }




        // Predict player collision with left bound box
        let leftCollision = this.predictCollisionWithBoundBox(player, leftBound);

        // Predict player collision with top bound box
        let topCollision = this.predictCollisionWithBoundBox(player, topBound);
        this.drawDebugBoundBox(leftBound);
        this.drawDebugBoundBox(topBound);

        return leftCollision ? "left" : topCollision ? "top" : false;
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

        this.pileHeight += Obstacle.OBSTACLE_SIZE;

        // sort obstacles by y position
        this.obstacles.sort((a, b) => a.y - b.y);
    }

    createObstacle(speed) {

        let y = this.obstacles.length * Obstacle.OBSTACLE_SIZE;

        let x = Obstacle.OBSTACLE_SIZE;

        this.addObstacle(new Obstacle(x, y, speed));
    }

}