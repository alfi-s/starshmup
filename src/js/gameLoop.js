import { init, initKeys, keyMap, GameLoop } from 'kontra';
import colors from './colors';
import Player, { PlayerState } from './player';
import { bulletPool } from './bullet';
import { particlePool, explosion, initStars, starPool } from './particle';
import { spawnTanky, spawnSineWave, spawnFighter } from './enemy';
import { gameOverUI, livesUI, scoreUI } from './ui';

// Kontra initialisation
export let { canvas, context } = init();
initKeys();
keyMap['ShiftLeft'] = 'shift';

function collides(a, b) {
    return a.x < b.x + b.width && a.x + b.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

let score = 0;
let gameOver = false;

let player = new Player({
    x: -90,
    y: (canvas.height / 2) + 100,
    width: 40,
    height: 35,
    speedHigh: 5,
    speedLow: 2,
    bulletTimerLow: 11,
    bulletTimerHigh: 6,
    lives: 5
});

let enemies = [];

const enemySpawner = {
    spawnTimerMax: 500, spawnTimer: 0,
    countdown: function () {
        if (this.spawnTimer == 0) {
            this.spawn();
            this.spawnTimer = this.spawnTimerMax;
        } else {
            this.spawnTimer--;
        }
    },
    spawn: function () {

        if (score < 100) {
            // sine
            enemies = enemies.concat(spawnSineWave(canvas.width + 50, Math.random() * canvas.height, Math.floor(Math.random() * (8 - 3 + 1) + 3)))
        } else if (score < 200) {
            //sine + fight
            let rand = Math.random();

            if (rand > 0.5) {
                enemies = enemies.concat(spawnFighter(canvas.width + 50, Math.random() * canvas.height))
            } else {
                enemies = enemies.concat(spawnFighter(canvas.width + 50, Math.random() * canvas.height))
                enemies = enemies.concat(spawnSineWave(canvas.width + 50, Math.random() * canvas.height, Math.floor(Math.random() * (8 - 3 + 1) + 3)))
            }
        } else if (score < 350) {
            //increase freq
            this.spawnTimerMax = 400;
            enemies = enemies.concat(spawnFighter(canvas.width + 50, Math.random() * canvas.height))
            enemies = enemies.concat(spawnFighter(canvas.width + 50, Math.random() * canvas.height))
            enemies = enemies.concat(spawnSineWave(canvas.width + 50, Math.random() * canvas.height, Math.floor(Math.random() * (8 - 3 + 1) + 3)))
        } else if (score < 600) {
            //tanky + sine
            this.spawnTimerMax = 500;
            let rand = Math.random();
            console.log(rand)
            if (rand > 0.2) {
                enemies = enemies.concat(spawnTanky(canvas.width + 50, Math.random() * (canvas.height - 100)))
                enemies = enemies.concat(spawnSineWave(canvas.width + 50, Math.random() * canvas.height, Math.floor(Math.random() * (8 - 3 + 1) + 3)))
            } else {
                enemies = enemies.concat(spawnFighter(canvas.width + 50, Math.random() * canvas.height))
                enemies = enemies.concat(spawnSineWave(canvas.width + 50, Math.random() * canvas.height, Math.floor(Math.random() * (8 - 3 + 1) + 3)))
                enemies = enemies.concat(spawnSineWave(canvas.width + 50, Math.random() * canvas.height, Math.floor(Math.random() * (8 - 3 + 1) + 3)))
            }
        } else if (score < 1000) {
            //tanky + sine + fight
            enemies = enemies.concat(spawnTanky(canvas.width + 50, Math.random() * canvas.height))
            enemies = enemies.concat(spawnFighter(canvas.width + 50, Math.random() * canvas.height))
            enemies = enemies.concat(spawnSineWave(canvas.width + 50, Math.random() * canvas.height, Math.floor(Math.random() * (8 - 3 + 1) + 3)))
            enemies = enemies.concat(spawnSineWave(canvas.width + 50, Math.random() * canvas.height, Math.floor(Math.random() * (8 - 3 + 1) + 3)))
            console.log('5')
        } else if (score < 1300) {
            //increase frequency
            this.spawnTimerMax = 370;
            enemies = enemies.concat(spawnTanky(canvas.width + 50, Math.random() * canvas.height))
            enemies = enemies.concat(spawnFighter(canvas.width + 50, Math.random() * canvas.height))
            enemies = enemies.concat(spawnFighter(canvas.width + 50, Math.random() * canvas.height))
            enemies = enemies.concat(spawnSineWave(canvas.width + 50, Math.random() * canvas.height, Math.floor(Math.random() * (8 - 3 + 1) + 3)))
            enemies = enemies.concat(spawnSineWave(canvas.width + 50, Math.random() * canvas.height, Math.floor(Math.random() * (8 - 3 + 1) + 3)))
            console.log('6')
        } else {
            //increase frequency
            this.spawnTimerMax = 300;
            enemies = enemies.concat(spawnTanky(canvas.width + 50, Math.random() * canvas.height))
            enemies = enemies.concat(spawnTanky(canvas.width + 50, Math.random() * canvas.height))
            enemies = enemies.concat(spawnFighter(canvas.width + 50, Math.random() * canvas.height))
            enemies = enemies.concat(spawnFighter(canvas.width + 50, Math.random() * canvas.height))
            enemies = enemies.concat(spawnSineWave(canvas.width + 50, Math.random() * canvas.height, Math.floor(Math.random() * (8 - 3 + 1) + 3)))
            enemies = enemies.concat(spawnSineWave(canvas.width + 50, Math.random() * canvas.height, Math.floor(Math.random() * (8 - 3 + 1) + 3)))
            console.log('7')
        }
    },
    reset: function () {
        this.spawnTimer = 0;
        this.spawnTimerMax = 500;
    }
}

initStars(canvas.width, canvas.height);

// Main game loop
export default GameLoop({
    update: function (dt) {

        enemySpawner.countdown();
        // Handle bullet collision.
        bulletPool.getAliveObjects().forEach(bullet => {
            if (bullet.target == 'player') {
                if (collides(bullet, player) && player.state == PlayerState.ALIVE) {
                    bullet.ttl = 0;
                    player.state = PlayerState.DEAD;
                }
            }
            if (bullet.target == 'enemy') {
                enemies.forEach(enemy => {
                    if (collides(bullet, enemy)) {
                        bullet.ttl = 0;
                        enemy.dmg(bullet.dmg);
                        if (!enemy.isAlive()) {
                            explosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 'orange', 100);
                            score += enemy.points;
                        }
                    }
                })
            }
        })

        // Update the enemies
        enemies = enemies.filter(enemy => enemy.isAlive());
        enemies.forEach(enemy => {
            if (collides(enemy, player) && player.state == PlayerState.ALIVE) {
                player.state = PlayerState.DEAD;
                explosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 'orange', 100);
                enemy.health = 0;
            }
            enemy.update(dt)
        });

        // Update the player.
        if (player.lives > 0) {
            player.update(dt);
            if (!player.isAlive()) {
                explosion(player.x, player.y, colors.cyan, 200)
                player.lives--;
                player.respawn();
            }
        } else {
            gameOver = true;
        }

        // Update the bulletPool
        bulletPool.update();
        particlePool.update();
        starPool.update();
        starPool.get({
            x: canvas.width + 1, y: Math.random() * canvas.height,
            dx: -3,
            width: 3,
            height: 3,
            color: Math.random() > 0.5 ? colors.violet : colors.indigo,
            isAlive: function () {
                return this.x > 0;
            }
        })
    },

    render: function () {
        // Background color.
        context.fillStyle = colors.bg;
        context.fillRect(0, 0, canvas.width, canvas.height);

        starPool.render();
        particlePool.render();
        bulletPool.render();

        // Render the player.
        player.render();
        enemies.forEach(enemy => enemy.render());

        scoreUI(score, canvas).render();
        livesUI(player.lives, canvas).render();
        if (gameOver) {
            gameOverUI(canvas).render();
        }
    }
});