class BlackHole {

    x
    y

    static BLACK_HOLE_ANIMATION

    counter

    blackHoleSize

    constructor() {
        this.counter = 10;

        this.blackHoleSize = 100 + (width * 0.2);

        this.x = 0
        this.y = 0 // to be set dynamically

    }

    static preload() {
        BlackHole.BLACK_HOLE_ANIMATION = loadImage('static/assets/blackhole/black-hole.gif');

    }

    draw() {

        this.y = height - environment.platformHeight - this.blackHoleSize;

        image(
            BlackHole.BLACK_HOLE_ANIMATION,
            this.x,
            this.y,
            this.blackHoleSize,
            this.blackHoleSize
        );

    }

    hasCollided(x, y) {
        return x < this.x + this.blackHoleSize - this.blackHoleSize / 4 &&
            x + this.blackHoleSize - this.blackHoleSize / 4 > this.x &&
            y < this.y + this.blackHoleSize - this.blackHoleSize / 6 &&
            y + this.blackHoleSize - this.blackHoleSize / 6 > this.y;
    }

}