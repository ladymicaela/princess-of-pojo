console.log("Webpack is working!")


document.addEventListener("DOMContentLoaded", function () {

    const SCALE = .5;
    const WIDTH = 223;
    const HEIGHT = 225;
    const SCALED_WIDTH = SCALE * WIDTH;
    const SCALED_HEIGHT = SCALE * HEIGHT;
    const CYCLE_LOOP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const FACING_LEFT = 0;
    const FACING_RIGHT = 1;

    const GOING_UP = 1;
    const GOING_DOWN = 1;

    const SLASH_RIGHT = 3;
    const SLASH_LEFT = 2;

    const MOVEMENT_SPEED = 1;
    const FRAME_LIMIT = 12;


    let canvasEl = document.getElementById('game-canvas');
    let ctx = canvasEl.getContext('2d');
    let keyPresses = {};
    let currentDirection = FACING_RIGHT;
    let lastDirection = "RIGHT"
    let currentLoopIndex = 0;
    let frameCount = 0;
    let positionX = 0;
    let positionY = 300;
    let img = new Image();


    window.addEventListener('keydown', keyDownListener, false);
    function keyDownListener(event) {
        keyPresses[event.key] = true;
    }

    window.addEventListener('keyup', keyUpListener, false);
    function keyUpListener(event) {
        keyPresses[event.key] = false;
    }


    function loadImage() {
        img.src = './spritesheet.png'
        img.onload = function () {
            window.requestAnimationFrame(gameLoop);
        }
    }

    function drawFrame(frameX, frameY, canvasX, canvasY) {
        ctx.drawImage(img,
            frameX * WIDTH, frameY * HEIGHT, WIDTH, HEIGHT,
            canvasX, canvasY, SCALED_WIDTH, SCALED_HEIGHT);
    }

    loadImage();

    function gameLoop() {

        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

        let hasMoved = false;

        if (keyPresses.ArrowUp && lastDirection === "RIGHT") {
            moveCharacter(0, -MOVEMENT_SPEED, FACING_RIGHT);
            hasMoved = true;
        } else if (keyPresses.ArrowDown && lastDirection === "RIGHT") {
            moveCharacter(0, MOVEMENT_SPEED, FACING_RIGHT);
            hasMoved = true;
        }
        if (keyPresses.ArrowUp && lastDirection === "LEFT") {
            moveCharacter(0, -MOVEMENT_SPEED, FACING_LEFT);
            hasMoved = true;
        } else if (keyPresses.ArrowDown && lastDirection === "LEFT") {
            moveCharacter(0, MOVEMENT_SPEED, FACING_LEFT);
            hasMoved = true;
        }
        if (keyPresses.ArrowLeft) {
            moveCharacter(-MOVEMENT_SPEED, 0, FACING_LEFT);
            hasMoved = true;
            lastDirection = "LEFT"
        } else if (keyPresses.ArrowRight) {
            moveCharacter(MOVEMENT_SPEED, 0, FACING_RIGHT);
            hasMoved = true;
            lastDirection = "RIGHT"
        }

        if (keyPresses.Shift && lastDirection === "RIGHT") {
            moveCharacter(0, 0, SLASH_RIGHT)
            hasMoved = true;
        } else if (keyPresses.Shift && lastDirection === "LEFT") {
            moveCharacter(0, 0, SLASH_LEFT)
            hasMoved = true;
        }

        if (hasMoved) {
            frameCount++;
            if (frameCount >= FRAME_LIMIT) {
                frameCount = 0;
                currentLoopIndex++;
                if (currentLoopIndex >= CYCLE_LOOP.length) {
                    currentLoopIndex = 0;
                }
            }
        }

        if (!hasMoved) {
            currentLoopIndex = 0;
        }

        drawFrame(CYCLE_LOOP[currentLoopIndex], currentDirection, positionX, positionY);
        window.requestAnimationFrame(gameLoop);
    }

    function moveCharacter(deltaX, deltaY, direction) {
        if ((positionX + deltaX > 0) && (positionX + SCALED_WIDTH + deltaX < canvasEl.width)) {
            positionX += deltaX;
        }
        if ((positionY + deltaY > 0) && (positionY + SCALED_HEIGHT + deltaY < canvasEl.height)) {
            positionY += deltaY;
        }
        currentDirection = direction;
    }

});

