import { init, initKeys, keyMap, GameLoop, collides } from 'kontra';
import colors from './colors';
import Player, { PlayerState } from './player';
import { bulletPool } from './bullet';
import { particlePool, explosion, initStars, starPool } from './particle';
import { Simple } from './enemy';

// Kontra initialisation
export let { canvas, context } = init();
initKeys();
keyMap['ShiftLeft'] = 'shift';

let player = new Player({
    x: -90,
    y: (canvas.height / 2) + 100,
    width: 20,
    height: 10,
    speedHigh: 4,
    speedLow: 2,
    bulletTimerLow: 11,
    bulletTimerHigh: 6
});

let enemies = [];
enemies.push(new Simple({
    x: canvas.width, y: canvas.height / 2, speed: 1, width: 20, height: 20, color: 'orange'
}))


initStars(canvas.width, canvas.height);

// Main game loop
export default GameLoop({

    update: function (dt) {
        // Handle bullet collision.
        bulletPool.getAliveObjects().forEach(bullet => {
            if (bullet.target == 'player') {
                if (collides(bullet, player)) {
                    bullet.ttl = 0;
                    player.health -= bullet.dmg;
                }
            }
            if (bullet.target == 'enemy') {
                enemies.forEach(enemy => {
                    if (collides(bullet, enemy)) {
                        bullet.ttl = 0;
                        enemy.dmg(bullet.dmg);
                    }
                })
            }
        })

        // Update the enemies
        enemies = enemies.filter(enemy => {
            const isAlive = enemy.isAlive();
            if (!isAlive) {
                explosion(enemy.x, enemy.y, 'orange', 100);
            }
            return isAlive;
        });
        enemies.forEach(enemy => {
            if (collides(enemy, player)) {
                player.health = 0;
                enemy.health = 0;
            }
            enemy.update(dt)
        });

        // Update the player.
        player.update(dt);
        if (!player.isAlive()) {
            explosion(player.x, player.y, colors.cyan, 200)
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
    }
});