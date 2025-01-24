class BlackHole {

    x
    y

    blackHoleAnimation

    counter

    blackHoleSize

    constructor() {
        this.counter = 0;

        this.blackHoleSize = 100 + (width * 0.2);

        this.x = 0
        this.y = 0 // to be set dynamically

    }

    preload() {
        this.blackHoleAnimation = new Animation(
            [
                'blackhole/black-hole1.png',
                'blackhole/black-hole2.png'
            ]
        )

    }

    draw() {

        this.y = height - environment.platformHeight - this.blackHoleSize;

        image(
            this.blackHoleAnimation.frames[this.counter <= 30 ? 0 : 1],
            this.x,
            this.y,
            this.blackHoleSize,
            this.blackHoleSize
        );

        this.counter++;

        if (this.counter > 60) {
            this.counter = 0;
        }

    }

    hasCollided(x, y) {
        return x < this.x + this.blackHoleSize - this.blackHoleSize / 4 &&
            x + this.blackHoleSize - this.blackHoleSize / 4 > this.x &&
            y < this.y + this.blackHoleSize - this.blackHoleSize / 6 &&
            y + this.blackHoleSize - this.blackHoleSize / 6 > this.y;
    }


}