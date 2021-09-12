import { init, initKeys, keyMap, GameLoop, collides } from 'kontra';
import colors from './colors';
import Player from './player';
import { bulletPool as bullets } from './bullet';

// Kontra initialisation
export let { canvas, context } = init();
initKeys();
keyMap['ShiftLeft'] = 'shift';


let player = new Player({
    x: 100,
    y: canvas.height / 2,
    width: 15,
    height: 7,
    speedHigh: 4,
    speedLow: 2,
    bulletTimerMax: 5
});
let enemies = [];

// Main game loop
export default GameLoop({
    update: function (dt) {
        // Handle bullet collision.
        bullets.getAliveObjects().forEach(bullet => {
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

        // Update the player.
        player.update(dt);

        // Update the enemies
        enemies = enemies.filter(enemy => enemy.isAlive());
        enemies.forEach(enemy => {
            if (collides(enemy, player)) {
                player.health = 0;
            }
            enemy.update(dt)
        });

        // Update the bullets
        bullets.update();
    },

    render: function () {
        // Background color.
        context.fillStyle = colors.bg;
        context.fillRect(0, 0, canvas.width, canvas.height);

        bullets.render();

        // Render the player.
        player.render();
        enemies.forEach(enemy => enemy.render());
    }
});