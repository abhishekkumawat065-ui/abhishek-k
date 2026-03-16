// ================= BOARD =================
let board;
let boardWidth = 350;
let boardHeight = 540;
let context;

// ================= BIRD =================
let birdWidth = 44;
let birdHeight = 34;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

// ================= PIPES =================
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// ================= PHYSICS =================
let velocityX = -1.5;
let velocityY = 0;
let gravity = 0.25;

let gameOver = false;
let score = 0;

// ================= SOUND =================
let jumpSound;
let scoreSound;
let gameOverSound;

// ================= LOAD =================
window.onload = function () {

    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // bird image
    birdImg = new Image();
    birdImg.src = "images/bird.png";

    // pipes images
    topPipeImg = new Image();
    topPipeImg.src = "images/top.jpeg";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "images/bottom.jpeg";

    // sounds
    jumpSound = new Audio("images/sounds/jumpsound.mp3");
    scoreSound = new Audio("images/sounds/scoresound.mp3");
    gameOverSound = new Audio("images/sounds/gameover.mp3");

    // browser sound unlock
    document.addEventListener("click", function () {
        jumpSound.play().then(()=>jumpSound.pause()).catch(()=>{});
    });

    requestAnimationFrame(update);
    setInterval(placePipes, 2000);

    document.addEventListener("keydown", moveBird);
    document.addEventListener("touchstart", moveBird);
};

// ================= GAME LOOP =================
function update() {

    requestAnimationFrame(update);

    if (gameOver) {
        context.fillStyle = "white";
        context.font = "32px Arial";
        context.fillText("GAME OVER", 80, 250);
        context.fillText("Press Space", 85, 290);
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // bird physics
    velocityY += gravity;
    bird.y += velocityY;
    bird.y = Math.max(bird.y, 0);

    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
        gameOverSound.currentTime = 0;
        gameOverSound.play();
    }

    // pipes
    for (let i = 0; i < pipeArray.length; i++) {

        let pipe = pipeArray[i];
        pipe.x += velocityX;

        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        // score
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {

            score += 0.5;
            pipe.passed = true;

            scoreSound.currentTime = 0;
            scoreSound.play();
        }

        // collision
        if (detectCollision(bird, pipe)) {

            gameOver = true;

            gameOverSound.currentTime = 0;
            gameOverSound.play();
        }
    }

    // remove pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    // score display
    context.fillStyle = "white";
    context.font = "30px Arial";
    context.fillText("Score: " + score, 10, 35);
}

// ================= PLACE PIPES =================
function placePipes() {

    if (gameOver) return;

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 2.5;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };

    pipeArray.push(topPipe);
    pipeArray.push(bottomPipe);
}

// ================= CONTROLS =================
function moveBird(e) {

    if (e.code === "Space" || e.code === "ArrowUp" || e.type === "touchstart") {

        velocityY = -6;

        jumpSound.currentTime = 0;
        jumpSound.play();
    }

    // restart game
    if (gameOver) {

        bird.y = birdY;
        velocityY = 0;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }
}

// ================= COLLISION =================
function detectCollision(a, b) {

    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}