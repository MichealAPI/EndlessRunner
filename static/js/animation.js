class Animation {
    frames = [];
    currentFrameHeight;
    currentFrameWidth;
    animationInterval = null; // Ensure only one interval exists
    frameIndex;

    constructor(frameList) {
        frameList.forEach((frame) => {
            let img = loadImage(`static/assets/${frame}`);
            this.frames.push(img);
        });
    }

    drawAnimation(player, frameRate, reverse = false, runnable = () => {}) {
        if (this.animationInterval) this.stopAnimation(player);

        player.isAnimationRunning = true;
        this.frameIndex = reverse ? this.frames.length - 1 : 0;

        const animate = () => {
            if ((!reverse && this.frameIndex >= this.frames.length) || (reverse && this.frameIndex < 0)) {
                this.stopAnimation(player);
                runnable();
                return;
            }

            player.setPlayerData(this.frames[this.frameIndex]);
            this.currentFrameHeight = this.frames[this.frameIndex].height;
            this.currentFrameWidth = this.frames[this.frameIndex].width;

            this.frameIndex += reverse ? -1 : 1;
            this.animationInterval = requestAnimationFrame(animate);
        };

        this.animationInterval = requestAnimationFrame(animate);
    }


    stopAnimation(player) {
        if (!this.animationInterval) return;
        clearInterval(this.animationInterval);
        this.animationInterval = null; // Reset the interval reference
        player.isAnimationRunning = false;
    }
}