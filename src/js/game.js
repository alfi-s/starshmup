import { init, initKeys, keyMap, GameLoop, collides } from 'kontra';
import colors from './colors';
import Player from './player';
import { bulletPool } from './bullet';
import Enemy, { SineEnemy } from './enemy';

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

let enemies = [];
enemies.push(new SineEnemy({
    x: 500, y: canvas.height / 2, width: 15, height: 15, color: 'red', speed: 2, amplitude: 100, frequency: 4, angleDisplacement: 3
}))
enemies.push(new SineEnemy({
    x: 550, y: canvas.height / 2, width: 15, height: 15, color: 'red', speed: 2, amplitude: 100, frequency: 4, angleDisplacement: 2
}))
enemies.push(new SineEnemy({
    x: 600, y: canvas.height / 2, width: 15, height: 15, color: 'red', speed: 2, amplitude: 100, frequency: 4, angleDisplacement: 1
}))
enemies.push(new SineEnemy({
    x: 650, y: canvas.height / 2, width: 15, height: 15, color: 'red', speed: 2, amplitude: 100, frequency: 4, angleDisplacement: 0
}))

export const gameLoop = GameLoop({
    update: function (dt) {
        // Check bullet collision
        bulletPool.getAliveObjects().forEach(bullet => {
            if (bullet.target == 'player') {
                if (collides(bullet, player)) {
                    bullet.ttl = 0;
                    player.health -= bullet.damage;
                }
            }
            if (bullet.target == 'enemy') {
                enemies.forEach(enemy => {
                    if (collides(bullet, enemy)) {
                        bullet.ttl = 0;
                        enemy.damage(bullet.damage);
                        console.log(enemy.health)
                    }
                })
            }
        })

        // Update the player.
        player.update(dt);

        // Update the enemies
        enemies = enemies.filter(enemy => enemy.isAlive());
        enemies.forEach(enemy => enemy.update(dt));

        // Update the bullet.s
        bulletPool.update();
    },

    render: function () {
        // Background color.
        context.fillStyle = colors.bg;
        context.fillRect(0, 0, canvas.width, canvas.height);

        bulletPool.render();

        // Render the player.
        player.render();
        enemies.forEach(enemy => enemy.render());
    }
});