class Environment {

    platformHeight; // Height of the base platform

    platformColor = color(173, 133, 90);

    backgroundColor = color(229, 170, 28);

    constructor(platformHeight) {

        this.platformHeight = platformHeight;

    }

    drawPlatform() {

        noStroke()
        fill(this.platformColor)

        rect(0, height - this.platformHeight, width, this.platformHeight);

    }

    drawBackground() {

        background(this.backgroundColor);

    }


}