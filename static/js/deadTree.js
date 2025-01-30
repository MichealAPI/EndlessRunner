class DeadTree {

    static DEFAULT_IMAGES = []

    y
    x
    speed
    currentImage

    static preload() {
        DeadTree.DEFAULT_IMAGES.push(loadImage('static/assets/tree/spooky-tree-1.png'));
        DeadTree.DEFAULT_IMAGES.push(loadImage('static/assets/tree/spooky-tree-2.png'));
        DeadTree.DEFAULT_IMAGES.push(loadImage('static/assets/tree/spooky-tree-3.png'));
    }

    constructor() {
        this.currentImage = DeadTree.DEFAULT_IMAGES[Math.floor(Math.random() * DeadTree.DEFAULT_IMAGES.length)];
        this.y = getPlatformExactY();
        this.x = width;
        this.speed = 1;
    }

    move() {
        this.x -= this.speed;
    }

    hasCollided() {
        return this.x <= 0;
    }

    draw() {
        image(
            this.currentImage,
            this.x,
            height - environment.platformHeight - this.currentImage.height * .6,
            this.currentImage.width * .6,
            this.currentImage.height * .6
        );
    }

}

let deadTrees = [];

function handleBackgroundTrees() {
    if (deadTrees.length === 0 || deadTrees[deadTrees.length - 1].x <= width - 300 - Math.random() * 100) {
        deadTrees.push(new DeadTree());
    }

    deadTrees.forEach((deadTree) => {
        deadTree.move();
        deadTree.draw();
        deadTree.hasCollided() && deadTrees.splice(deadTrees.indexOf(deadTree), 1);
    });
}