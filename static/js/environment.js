class Environment {

    ambiances = new Map([
        ["hell", {
            "backgroundColor": color(67, 12, 12),
            "platformColor": color(0, 0, 0),
            "textColorPrimary": color(96, 36, 36),
            "textColorSecondary": color(127, 69, 69)
        }],
        ["default", {
            "backgroundColor": color(255, 205, 84),
            "platformColor": color(173, 133, 90),
            "textColorPrimary": color(105, 78, 42),
            "textColorSecondary": color(177, 132, 23)
        }]
    ])

    currentAmbiance

    platformHeight; // Height of the base platform

    platformColor

    backgroundColor

    textColorSecondary

    textColorPrimary

    static ASSETS = new Map()

    static preload() {
        Environment.ASSETS.set("vignette", loadImage('static/assets/other/vignette.png'));
    }

    constructor(platformHeight) {

        this.platformHeight = platformHeight;

        this.changeAmbientColor("default")

    }

    drawAmbiance() {
        this.drawBackground();
        this.drawPlatform();

        if (this.currentAmbiance === "hell") {
            this.drawHell();
        }
    }

    drawPlatform() {

        noStroke()
        fill(this.platformColor)

        rect(0, height - this.platformHeight, width, this.platformHeight);

    }

    drawBackground() {
        background(this.backgroundColor);
    }

    drawHell() {
        handleBackgroundTrees();
    }

    drawVignette() {
        // draw vignette
        image(
            Environment.ASSETS.get("vignette"),
            0,
            0,
            width,
            height
        );
    }

    changeAmbientColor(id) {

        if (this.currentAmbiance === id) {
            return
        }


        let ambiance = this.ambiances.get(id);

        this.platformColor = ambiance["platformColor"];
        this.backgroundColor = ambiance["backgroundColor"];
        this.textColorPrimary = ambiance["textColorPrimary"];
        this.textColorSecondary = ambiance["textColorSecondary"];

        this.currentAmbiance = id;

        this.drawBackground()
        this.drawPlatform()
    }


}