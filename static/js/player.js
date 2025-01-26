class Player {

    static ANIMATIONS = new Map()
    static DEFAULT_STATE_IMG

    keyMap = new Map();

    x = 0
    y = 0
    horizontalSpeed = 5 // in pixels
    maxJumpHeight = 400 // in pixels
    
    size

    isJumping = false
    moveLeft = false
    moveRight = false

    mirrorModifier = 1

    steps = 0

    playerData
    moved = false

    freeze = false

    opacity = 255

    onPlatform = false

    highScore = 0
    
    init() {

        this.keyMap.set('KeyD', 'moveRight');
        this.keyMap.set('KeyA', 'moveLeft');
        this.keyMap.set('Space', 'jump');
        this.keyMap.set('KeyP', 'pause');
        this.keyMap.set('KeyM', 'mute');

        this.registerListeners();

        this.resetPlayerData()

        this.setOnPlatform()

    }

    setOnPlatform() {
        this.x = blackHole.x + blackHole.blackHoleSize + 50;
        this.y = height - environment.platformHeight - this.playerData.height;
    }

    static preload() {

        Player.DEFAULT_STATE_IMG = loadImage('static/assets/cat-1.png');

        Player.ANIMATIONS.set(
            'jump',
            new Animation([
                'jump/jumping-cat1.png',
                'jump/jumping-cat2.png',
                'jump/jumping-cat3.png',
                'jump/jumping-cat4.png',
                'jump/jumping-cat5.png',
                'jump/jumping-cat6.png',
                'jump/jumping-cat7.png',
                'jump/jumping-cat8.png',
                'jump/jumping-cat9.png',
                'jump/jumping-cat10.png',
            ])
        );

        Player.ANIMATIONS.set(
            'run',
            new Animation([
                'run/running-cat1.png',
                'run/running-cat2.png',
            ])
        )

    }

    resetPlayerData() {
        this.setPlayerData(Player.DEFAULT_STATE_IMG);
    }

    setPlayerData(playerData) {
        this.playerData = playerData
    }

    draw() {

        // Check if player is on ground
        if (this.y === height - environment.platformHeight - this.playerData.height) {
            this.onPlatform = false;
        }

        // Black hole dragging effect
        player.x -= .2;

        // Horizontal movement logic
        if (this.moveLeft && !this.freeze) {
            this.x = Math.max(0, this.x - this.horizontalSpeed);
            this.mirrorModifier = -1; // Face left
        }

        if (this.moveRight && !this.freeze) {
            this.x = Math.min(width - this.playerData.width, this.x + this.horizontalSpeed);
            this.mirrorModifier = 1; // Face right
        }

        // Update animation
        if ((this.moveRight || this.moveLeft) && !this.isJumping && !this.freeze) {
            this.steps += 0.5;

            if (this.steps < 5) {
                this.setPlayerData(Player.ANIMATIONS.get('run').frames[0]);
            } else {
                this.setPlayerData(Player.ANIMATIONS.get('run').frames[1]);
            }

            if (this.steps >= 10) {
                this.steps = 0;
            }
        }

        push();
        // Mirror the image if moving left
        if (this.mirrorModifier === -1) {
            scale(-1, 1); // Mirror horizontally
        }

        tint(255, this.opacity);

        // Draw the player
        image(
            this.playerData,
            this.mirrorModifier === -1 ? -this.x - this.playerData.width : this.x,
            this.y,
            this.mirrorModifier * this.playerData.width,
            this.playerData.height
        );

        pop();

        // Check for collision with black hole
        if (blackHole.hasCollided(this.x, this.y)) {

            this.freeze = true;

            this.opacity -= 4;
            player.y -= 2;
            player.x -= 2;

            // Check if player is in the middle of the black hole
            if (player.y >= blackHole.y + blackHole.blackHoleSize / 2 && player.x >= blackHole.x && player.x <= blackHole.x + (blackHole.blackHoleSize / 2)) {
                lose();
            }

        }
    }





    async moveJump() {
        if (this.isJumping) return;
        playJumpSound();

        this.isJumping = true;

        const jumpAnimation = Player.ANIMATIONS.get('jump');
        const jumpDuration = 800; // Total jump duration in ms
        const frameDuration = 20; // Frame duration in ms
        const peakHeight = this.maxJumpHeight;
        let groundLevel = player.y;
        let landingLevel = groundLevel - peakHeight;

        if (player.onPlatform) { // todo fix here
            landingLevel = height - environment.platformHeight;
        }

        jumpAnimation.drawAnimation(this, frameDuration, false); // Start forward animation for jump

        const startTime = performance.now();
        let elapsedTime;

        // Smooth parabolic motion
        do {
            if (!this.isJumping) break; // Stop if landing on a platform

            elapsedTime = performance.now() - startTime;
            const progress = elapsedTime / jumpDuration;

            if (elapsedTime >= jumpDuration * .7) {
                jumpAnimation.stopAnimation(player);
                jumpAnimation.drawAnimation(this, frameDuration, true); // Start reverse animation
            }

            // Parabolic easing: -4 * x * (x - 1)
            const parabolicFactor = -4 * progress * (progress - 1);
            this.y = Math.min(
                groundLevel,
                landingLevel * parabolicFactor
            );

            await new Promise((resolve) => requestAnimationFrame(resolve));
        } while (elapsedTime < jumpDuration);

        this.isJumping = false;
        this.resetPlayerData(); // Reset to default state
    }





    registerListeners() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    handleKeyDown(event) {
        const action = this.keyMap.get(event.code);
        if (action) {
            this.moved = true;

            this[action] = true;
            if (action === 'jump' && !this.isJumping) this.moveJump();
            if (action === 'pause') togglePause();
            if (action === 'mute') toggleSound();
        }
    }

    handleKeyUp(event) {
        const action = this.keyMap.get(event.code);
        if (action) {
            this[action] = false;
            if (action === 'moveLeft' || action === 'moveRight') this.resetPlayerData();
        }
    }




}