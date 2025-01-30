class Player {

    static ANIMATIONS = new Map()
    static DEFAULT_STATE_IMG

    keyMap = new Map();

    x = 0
    y = 0
    horizontalSpeed = 5 // in pixels
    maxJumpHeight = 400 // in pixels
    gravity = 0.2 // in pixels

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
    sideCollision = false

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

        // draw player x debug rectangle
        //fill(255, 0, 0);
        //rect(this.x, this.y + this.playerData.height, 5, 5);

        // Check if player is on ground
        if (this.y === getPlatformExactY()) {
            this.onPlatform = false;

        } else if(!this.onPlatform && !player.isJumping && !this.freeze) {
            this.y += this.gravity * 100;
        }




        // Black hole dragging effect
        player.x -= .2;

        // Horizontal movement logic
        if (this.moveLeft && !this.freeze) {
            this.x = Math.max(0, this.x - this.horizontalSpeed);
            this.mirrorModifier = -1; // Face left
        }

        if (this.moveRight && !this.freeze && !this.sideCollision) {
            this.x = Math.min(width - this.playerData.width, this.x + this.horizontalSpeed);
            this.mirrorModifier = 1; // Face right

        }

        // Update animation
        if ((this.moveRight || this.moveLeft) && !player.isJumping && !this.freeze) {
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
            setTimeout(() => {
                lose();
            }, 600);

        }
    }



    async moveJump() {
        if (this.isJumping) return;
        this.isJumping = true;
        playJumpSound();

        const jumpAnimation = Player.ANIMATIONS.get('jump');
        const startTime = performance.now();

        let velocity = -Math.sqrt(2 * this.gravity * this.maxJumpHeight); // Initial upward velocity
        let elapsedTime;

        jumpAnimation.drawAnimation(this, 20, false);

        do {
            elapsedTime = performance.now() - startTime;
            const deltaTime = elapsedTime / 1000; // Convert ms to seconds

            if (!this.isJumping) break;

            // Apply physics: velocity decreases due to gravity
            velocity += this.gravity;
            this.y += velocity;  // Update position

            // Stop falling at the ground level or platform
            if (this.y >= getPlatformExactY()) {
                this.y = getPlatformExactY()
                break;
            }

            await new Promise(resolve => requestAnimationFrame(resolve));
        } while (true);

        this.isJumping = false;
        this.resetPlayerData();
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