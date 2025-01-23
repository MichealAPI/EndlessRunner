class Obstacle {

    static OBSTACLE_SIZE = 100;
    static DEFAULT_IMAGES = [];

    currentImage = Obstacle.DEFAULT_IMAGES[getRandomInt(0, Obstacle.DEFAULT_IMAGES.length - 1)];

    x
    y
    speed

    rotationAngle = 0;

    constructor(relativeX, relativeY, speed) {
        this.x = width - relativeX;
        this.y = height - environment.platformHeight - relativeY - Obstacle.OBSTACLE_SIZE;
        this.speed = speed
    }

    hasCollided() {
        return this.x < player.x + player.playerData.width &&
            this.x + Obstacle.OBSTACLE_SIZE > player.x &&
            this.y < player.y + player.playerData.width &&
            this.y + Obstacle.OBSTACLE_SIZE > player.y;

    }

    isOutside() {

        return this.x < 0 || this.x > width || this.y < 0 || this.y > height;

    }

    move() {
        this.x -= this.speed;

        this.rotationAngle -= 0.2;
    }

    draw() {

        // Rotate on its own axis
        //push();

        //translate(this.x + Obstacle.OBSTACLE_SIZE / 2, this.y + Obstacle.OBSTACLE_SIZE / 2);
        //rotate(this.rotationAngle);

        image(
            this.currentImage,
            //-Obstacle.OBSTACLE_SIZE / 2,
            //-Obstacle.OBSTACLE_SIZE / 2,
            this.x,
            this.y,
            Obstacle.OBSTACLE_SIZE,
            Obstacle.OBSTACLE_SIZE
        );

        //pop();
    }

    static preload() {
        Obstacle.DEFAULT_IMAGES.push(loadImage('static/assets/ball_of_wool.png'));
        Obstacle.DEFAULT_IMAGES.push(loadImage('static/assets/wooden_box.png'));
    }

}


class ObstaclePile {

    obstacles = []

    generate(obstaclesAmount = 1, linearSpeed = 1) {
        for (let i = 0; i < obstaclesAmount; i++) {
            this.createObstacle(linearSpeed);
        }
    }

    draw() {

        for (let obstacle of this.obstacles) {

            if (obstacle.isOutside()) {
                this.obstacles.splice(this.obstacles.indexOf(obstacle), 1);

                score += 1;
                playPointSound();
                continue;
            }

            if (obstacle.hasCollided()) {

                lose();

                break;

            }

            obstacle.move()

            //obstacle.move();
            obstacle.draw();

        }

    }

    addObstacle(obstacle) {
        this.obstacles.push(obstacle);
    }

    createObstacle(speed) {

        let y = this.obstacles.length * Obstacle.OBSTACLE_SIZE;

        let x = Obstacle.OBSTACLE_SIZE;

        this.addObstacle(new Obstacle(x, y, speed));
    }

    clearObstacles() {
        this.obstacles = [];
    }

}