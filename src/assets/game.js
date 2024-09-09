let Game;
let gameOver = false;
let score = 0;
let maxScore = 0;

function moveDoodler(event) {
    if (event.code == "ArrowRight" || event.code == "KeyD") {
        Game.player.image = Game.player.right;
        Game.velocity.x = 4;
    } else if (event.code == "ArrowLeft" || event.code == "KeyA") {
        Game.player.image = Game.player.left;
        Game.velocity.x = -4;
    } else if (event.code == "Space" && gameOver) {
        Game.player.x = Game.board.width / 2 - 23;
        Game.player.y = Game.board.height * 7 / 8 - 46;
        Game.velocity.x = 0;
        Game.velocity.y = Game.velocity.initialY;
        gameOver = false;
        score = 0;
        maxScore = 0;
        place();
    }
}

function place() {
    let { width, height, image } = Game.platform;
    Game.platform.cache = [];

    let platform = {
        image,
        x: Game.board.width / 2,
        y: Game.board.height - 50,
        width,
        height
    }

    Game.platform.cache.push(platform);

    for (let index = 0; index < 6; index++) {
        let randomX = Math.floor(Math.random() * Game.board.width * 3 / 4);
        let platform = {
            image,
            x: randomX,
            y: Game.board.height - 75 * index - 150,
            width,
            height
        }

        Game.platform.cache.push(platform);
    }
}

function plat() {
    let randomX = Math.floor(Math.random() * Game.board.width * 3 / 4);
    let platform = {
        image: Game.platform.image,
        x: randomX,
        y: -Game.platform.height,
        width: Game.platform.width,
        height: Game.platform.height
    }

    Game.platform.cache.push(platform);
}

function Update() {
    requestAnimationFrame(Update);

    if (gameOver)
        return;

    Game.context.clearRect(0, 0, Game.board.width, Game.board.height);
    Game.player.x += Game.velocity.x;
    if (Game.player.x > Game.board.width)
        Game.player.x = 0;
    else if (Game.player.x + Game.player.width < 0)
        Game.player.x = Game.board.width;

    Game.velocity.y += Game.velocity.gravity;
    Game.player.y += Game.velocity.y;
    if (Game.player.y > Game.board.height)
        gameOver = true;

    Game.context.drawImage(Game.player.image, Game.player.x, Game.player.y, Game.player.width, Game.player.height);

    for (let index = 0; index < Game.platform.cache.length; index++) {
        let platform = Game.platform.cache[index];
        if (Game.velocity.y < 0 && Game.player.y < Game.board.height * 3 / 4)
            platform.y -= Game.velocity.initialY;
        if (detectCollision(Game.player, platform) && Game.velocity.y >= 0)
            Game.velocity.y = Game.velocity.initialY;

        Game.context.drawImage(platform.image, platform.x, platform.y, platform.width, platform.height);
    }

    while (Game.platform.cache[0].y >= Game.board.height) {
        Game.platform.cache.shift();
        plat();
    }

    updateScore();
    Game.context.fillStyle = "black";
    Game.context.font = "16px sans-serif";
    Game.context.fillText(score, 5, 20);

    if (gameOver)
        Game.context.fillText("Game Over: Press 'Space' to Restart", Game.board.width / 7, Game.board.height * 7 / 8);
}

function detectCollision(player, platform) {
    return player.x < platform.x + platform.width && player.x + player.width > platform.x && player.y < platform.y + platform.height && player.y + player.height > platform.y;
}

function updateScore() {
    let points = Math.floor(50 * Math.random());
    if (Game.velocity.y < 0) {
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
        }
    } else if (Game.velocity.y >= 0) {
        maxScore -= points;
    }
}

window.onload = function () {
    Game = {
        canvas: document.getElementById('board'),
        board: {
            height: 576,
            width: 360
        },
        platform: {
            image: null,
            width: 60,
            height: 18,
            cache: []
        },
        player: {
            image: null,
            x: 360 / 2 - 23,
            y: 576 * 7 / 8 - 46,
            width: 46,
            height: 46,
            right: null,
            left: null
        },
        velocity: {
            x: 0,
            y: 0,
            initialY: -8,
            gravity: 0.4
        },
        run: function () {
            this.canvas.width = this.board.width;
            this.canvas.height = this.board.height;
            this.context = this.canvas.getContext('2d');
            this.player.right = new Image();
            this.player.right.src = './assets/right.png';
            this.player.image = this.player.right;
            this.player.right.onload = function () {
                Game.context.drawImage(Game.player.image, Game.player.x, Game.player.y, Game.player.width, Game.player.height);
            }
            this.player.left = new Image();
            this.player.left.src = './assets/left.png';
            this.platform.image = new Image();
            this.platform.image.src = './assets/platform.png';
        }
    }

    Game.run();
    place();
    requestAnimationFrame(Update);
    document.addEventListener("keydown", moveDoodler);
}

