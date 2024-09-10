let Game;
let gameOver = false;
let score = 0;
let maxScore = 0;
let max = 0;

function moveDoodler(event) {
    if (event.code == 'ArrowRight' || event.code == 'KeyD') {
        Game.player.image = Game.player.right;
        Game.velocity.x = 4;
    } else if (event.code == 'ArrowLeft' || event.code == 'KeyA') {
        Game.player.image = Game.player.left;
        Game.velocity.x = -4;
    } else if (event.code == 'Space' && gameOver) {
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
    let { width, height, image, imageBreak } = Game.platform;
    Game.platform.cache = [];

    let platform = {
        image,
        x: Game.board.width / 2,
        y: Game.board.height - 50,
        width,
        height,
        breakable: false
    }

    Game.platform.cache.push(platform);

    let previousY = platform.y;
    let minYGap = 80; 
    let maxYGap = 150; 

    for (let index = 0; index < 6; index++) {
        let randomX = Math.floor(Math.random() * Game.board.width * 3 / 4);
        let isBreakable = Math.random() > 0.7;

        if (Game.platform.cache.filter(platform => platform.breakable).length > 3) 
            isBreakable = false;

        let yGap = Math.random() * (maxYGap - minYGap) + minYGap;
        let platform = {
            image: isBreakable ? imageBreak : image,
            x: randomX,
            y: previousY - yGap, 
            width,
            height,
            breakable: isBreakable
        }

        Game.platform.cache.push(platform);
        previousY = platform.y; 
    }
}

function plat() {
    let randomX = Math.floor(Math.random() * Game.board.width * 3 / 4);
    let isBreakable = Math.random() > 0.8;
    
    let previousPlatform = Game.platform.cache[Game.platform.cache.length - 1];
    let minYGap = 80; 
    let maxYGap = 150; 
    let yGap = Math.random() * (maxYGap - minYGap) + minYGap;

    if (Game.platform.cache.filter(platform => platform.breakable).length > 3) 
        isBreakable = false;

    let platform = {
        image: isBreakable ? Game.platform.imageBreak : Game.platform.image,
        x: randomX,
        y: previousPlatform.y - yGap,
        width: Game.platform.width,
        height: Game.platform.height,
        breakable: isBreakable
    }

    Game.platform.cache.push(platform);
}

function Update() {
    requestAnimationFrame(Update);

    if (gameOver) return;

    Game.context.clearRect(0, 0, Game.board.width, Game.board.height);
    Game.player.x += Game.velocity.x;
    if (Game.player.x > Game.board.width)
        Game.player.x = 0;
    else if (Game.player.x + Game.player.width < 0) 
        Game.player.x = Game.board.width;

    if (Game.velocity.y < -12) {
        Game.velocity.y = -12;
    }

    Game.velocity.y += Game.velocity.gravity;
    Game.player.y += Game.velocity.y;
    if (Game.player.y > Game.board.height) gameOver = true;

    Game.context.drawImage(Game.player.image, Game.player.x, Game.player.y, Game.player.width, Game.player.height);

    for (let index = 0; index < Game.platform.cache.length; index++) {
        let platform = Game.platform.cache[index];

        if (Game.velocity.y < 0 && Game.player.y < Game.board.height * 3 / 4) {
            platform.y -= Game.velocity.initialY;
        }

        if (detectCollision(Game.player, platform) && Game.velocity.y >= 0) {
            Game.velocity.y = Game.velocity.initialY;
            if (platform.breakable) {
                Game.platform.cache.splice(index, 1);
                index--;
                plat();
            }
        }

        Game.context.drawImage(platform.image, platform.x, platform.y, platform.width, platform.height);
    }

    let platformBuffer = 2 * Game.platform.height;
    let lastPlatform = Game.platform.cache[Game.platform.cache.length - 1];
    if (lastPlatform.y < Game.board.height - platformBuffer) {
        plat();
    }

    while (Game.platform.cache[0].y >= Game.board.height) {
        Game.platform.cache.shift();
        plat(); 
    }

    updateScore();
    Game.context.fillStyle = 'black';
    Game.context.font = '16px sans-serif';
    Game.context.fillText('Score: ' + score, 10, 20);
    let Max = 'Max: ' + max;
    Game.context.fillText(Max, Game.board.width - Game.context.measureText(Max).width - 10, 20);

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
        if (score < maxScore)
            score = maxScore;
    } else if (Game.velocity.y >= 0)
        maxScore = Math.max(0, maxScore - points);

    if (max < score)
        max = score;
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
            imageBreak: null,
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
            this.platform.imageBreak = new Image();
            this.platform.imageBreak.src = './assets/platform-broken.png';
        }
    }

    Game.run();
    place();
    requestAnimationFrame(Update);
    document.addEventListener('keydown', moveDoodler);
}
