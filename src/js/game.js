import { init, initKeys, keyMap, GameLoop, collides } from 'kontra';
import colors from './colors';
import Player from './player';
import { bulletPool } from './bullet';
import Enemy from './enemy';

//Kontra initialisation
let { canvas, context } = init();
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

let enemy = new Enemy({
    x: 500,
    y: canvas.height / 2,
    width: 50,
    height: 50,
    health: 100,
    color: 'red'
})
export const gameLoop = GameLoop({
    update: function () {

        bulletPool.getAliveObjects().forEach(bullet => {
            if (collides(bullet, enemy)) {
                enemy.health -= bullet.damage;
                bullet.ttl = 0;
            }
        })

        player.update();
        enemy.update();

        bulletPool.update();
    },

    render: function () {
        // Background color.
        context.fillStyle = colors.bg;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Render the player.
        player.render();

        bulletPool.render();
        if (enemy.isAlive()) enemy.render();
    }
});