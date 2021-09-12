import { init, initKeys, keyMap, GameLoop, collides } from 'kontra';
import colors from './colors';
import GameManager from './gameManager'

// Kontra initialisation
export let { canvas, context } = init();
initKeys();
keyMap['ShiftLeft'] = 'shift';

let gameManager = new GameManager(canvas);

// Main game loop
export default GameLoop({
    update: function (dt) {
        // Handle bullet collision.
        gameManager.bulletPool.getAliveObjects().forEach(bullet => {
            if (bullet.target == 'player') {
                if (collides(bullet, player)) {
                    bullet.ttl = 0;
                    player.health -= bullet.dmg;
                }
            }
            if (bullet.target == 'enemy') {
                gameManager.enemies.forEach(enemy => {
                    if (collides(bullet, enemy)) {
                        bullet.ttl = 0;
                        enemy.dmg(bullet.dmg);
                    }
                })
            }
        })

        // Update the player.
        gameManager.player.update(dt);

        // Update the enemies
        gameManager.enemies = gameManager.enemies.filter(enemy => enemy.isAlive());
        gameManager.enemies.forEach(enemy => {
            if (collides(enemy, player)) {
                player.health = 0;
            }
            enemy.update(dt)
        });

        // Update the bullets
        gameManager.bulletPool.update();
    },

    render: function () {
        // Background color.
        context.fillStyle = colors.bg;
        context.fillRect(0, 0, canvas.width, canvas.height);

        gameManager.bulletPool.render();

        // Render the player.
        gameManager.player.render();
        gameManager.enemies.forEach(enemy => enemy.render());
    }
});