class Obstacle {

    static OBSTACLE_SIZE = 48;
    static DEFAULT_IMAGE

    x
    y
    speed

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
    }

    draw() {

        image(
            Obstacle.DEFAULT_IMAGE,
            this.x,
            this.y,
            Obstacle.OBSTACLE_SIZE,
            Obstacle.OBSTACLE_SIZE
        );
    }

    static preload() {
        Obstacle.DEFAULT_IMAGE = loadImage('static/assets/ball_of_wool.png');
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

                points += 1;
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