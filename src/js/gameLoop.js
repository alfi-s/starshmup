import { init, initKeys, keyMap, GameLoop } from 'kontra';
import colors from './colors';
import Player, { PlayerState } from './player';
import { bulletPool } from './bullet';
import { particlePool, explosion, initStars, starPool } from './particle';
import { Tanky, spawnSineWave } from './enemy';
import { livesUI, scoreUI } from './ui';

// Kontra initialisation
export let { canvas, context } = init();
initKeys();
keyMap['ShiftLeft'] = 'shift';

function collides(a, b) {
    return a.x < b.x + b.width && a.x + b.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

let score = 0;

let player = new Player({
    x: -90,
    y: (canvas.height / 2) + 100,
    width: 20,
    height: 10,
    speedHigh: 5,
    speedLow: 2,
    bulletTimerLow: 11,
    bulletTimerHigh: 6,
    lives: 5
});

let enemies = [];
enemies.push(new Tanky({
    x: canvas.width, y: canvas.height / 2, speed: 1, color: 'orange'
}))

enemies = enemies.concat(spawnSineWave(canvas.width + 10, (canvas.height / 2) + 100, 6, 100, 2, 1.5, 50));

initStars(canvas.width, canvas.height);

// Main game loop
export default GameLoop({

    update: function (dt) {
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
                            explosion(enemy.x, enemy.y, 'orange', 100);
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
                explosion(enemy.x, enemy.y, 'orange', 100);
                enemy.health = 0;
            }
            enemy.update(dt)
        });

        // Update the player.
        player.update(dt);
        if (!player.isAlive()) {
            explosion(player.x, player.y, colors.cyan, 200)
            player.lives--;
            player.respawn();
        }

        // Update the bulletPool
        bulletPool.update();
        particlePool.update();
        starPool.update();
        starPool.get({
            x: canvas.width + 1, y: Math.random() * canvas.height,
            dx: -0.5,
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
    }
});