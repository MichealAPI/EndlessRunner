class Player {

    static ANIMATIONS = new Map()
    static DEFAULT_STATE_IMG

    keyMap = new Map();

    x
    y
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

    highScore = 0
    
    init() {

        this.keyMap.set('KeyD', 'moveRight');
        this.keyMap.set('KeyA', 'moveLeft');
        this.keyMap.set('Space', 'jump');
        this.keyMap.set('KeyP', 'pause');
        this.keyMap.set('KeyM', 'mute');

        this.x = 0;
        this.y = 0;

        this.registerListeners();

        this.resetPlayerData()
        this.y = height - environment.platformHeight - this.playerData.height;

    }

    setOnPlatform() {
        this.x = 0;
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
            ], this)
        );

        Player.ANIMATIONS.set(
            'run',
            new Animation([
                'run/running-cat1.png',
                'run/running-cat2.png',
            ], this)
        )

    }

    resetPlayerData() {
        this.setPlayerData(Player.DEFAULT_STATE_IMG);
    }

    setPlayerData(playerData) {
        this.playerData = playerData
    }

    draw() {

        if (this.moveLeft) {
            this.x = Math.max(0, this.x - this.horizontalSpeed);

            // rotate towards the left
            this.mirrorModifier = -1;
        }

        if (this.moveRight) {
            this.x = Math.max(0, this.x + this.horizontalSpeed);
            this.mirrorModifier = 1;
        }

        if (this.moveRight || this.moveLeft) {

            if (!this.isJumping) {
                this.steps += .5;

                if (this.steps < 5) {
                    this.setPlayerData(Player.ANIMATIONS.get('run').frames[0]);
                } else {
                    this.setPlayerData(Player.ANIMATIONS.get('run').frames[1]);
                }

                if (this.steps >= 10) {
                    this.steps = 0;
                }
            }
        }

        if(this.mirrorModifier === -1) {
            push();
            scale(-1, 1); // If user is moving left, mirror the image
        }

        image(
            this.playerData,
            this.mirrorModifier === -1 ? -this.x - this.playerData.width : this.x,
            this.y,
            this.mirrorModifier * this.playerData.width,
            this.playerData.height
        );

        if(this.mirrorModifier === -1) {
            pop();
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
        const groundLevel = height - environment.platformHeight - this.playerData.height;

        jumpAnimation.drawAnimation(this, frameDuration, false); // Start forward animation for jump

        const startTime = performance.now();
        let elapsedTime;

        // Smooth parabolic motion
        do {
            elapsedTime = performance.now() - startTime;
            const progress = elapsedTime / jumpDuration;

            // Parabolic easing: -4 * x * (x - 1)
            const parabolicFactor = -4 * progress * (progress - 1);
            this.y = groundLevel - peakHeight * parabolicFactor;

            await new Promise((resolve) => requestAnimationFrame(resolve));
        } while (elapsedTime < jumpDuration);

        jumpAnimation.stopAnimation(this); // Stop jump animation
        this.y = groundLevel; // Ensure player lands at ground level
        this.resetPlayerData();
        this.isJumping = false;
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