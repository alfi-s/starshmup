import { Sprite, keyPressed, lerp } from "kontra";
import { bulletPool } from './bullet'
import colors from './colors';
import { playLaserSound } from './audio'

export const PlayerState = { SPAWN: 1, ALIVE: 2, DEAD: 3 }

export default class Player extends Sprite.class {
    constructor(props) {
        super(props);
        this.type = 'player';
        this.lives = props.lives;
        this.speedLow = props.speedLow;
        this.speedHigh = props.speedHigh;

        this.bulletTimerHigh = props.bulletTimerHigh;
        this.bulletTimerLow = props.bulletTimerLow;
        this.bulletTimerMax = this.bulletTimerHigh;
        this.bulletTimer = this.bulletTimerMax;

        this.spawnTimerMax = 50;
        this.spawnTimer = 0;

        this.state = PlayerState.SPAWN;
    }

    spawn() {
        this.x = lerp(this.x, 100, this.spawnTimer / this.spawnTimerMax);
        this.y = lerp(this.y, this.context.canvas.height / 2, this.spawnTimer / this.spawnTimerMax);
        this.spawnTimer++;
        if (this.spawnTimer === this.spawnTimerMax) {
            this.state = PlayerState.ALIVE;
        }
    }

    respawn() {
        this.health = 100;
        this.x = -90;
        this.y = (this.context.canvas.height / 2) + 100;
        this.spawnTimer = 0;
        this.state = PlayerState.SPAWN;
    }

    handleInput() {
        // handle the movement input
        let movementSpeed = null;
        if (keyPressed('shift')) {
            this.bulletTimerMax = this.bulletTimerHigh;
            movementSpeed = this.speedLow;
        } else {
            this.bulletTimerMax = this.bulletTimerLow;
            movementSpeed = this.speedHigh;
        }

        if (keyPressed('up') && this.y > 0) {
            this.dy = -movementSpeed;
        } else if (keyPressed('down') && this.y <= this.context.canvas.height) {
            this.dy = movementSpeed;
        } else {
            this.dy = 0;
        }

        if (keyPressed('left') && this.x > 0) {
            this.dx = -movementSpeed;
        } else if (keyPressed('right') && this.x <= this.context.canvas.width) {
            this.dx = movementSpeed;
        } else {
            this.dx = 0;
        }

        // handle firing bullets
        this.bulletTimer = this.bulletTimer > 0 ? this.bulletTimer - 1 : 0;
        if (keyPressed('space') && this.bulletTimer <= 0) {
            playLaserSound();
            bulletPool.get({
                x: this.x,
                y: this.y,
                width: 5,
                height: 5,
                dx: 14,
                dmg: 10,
                target: 'enemy',
                color: colors.skyblue
            });
            this.bulletTimer = this.bulletTimerMax;
        }
    }

    update() {
        switch (this.state) {
            case PlayerState.SPAWN:
                this.spawn();
                break;

            case PlayerState.ALIVE:
                this.handleInput();
                break;
        }


        this.advance();
    }

    draw() {
        this.context.fillStyle = colors.cyan;
        this.context.beginPath();
        this.context.moveTo(-this.width / 2, -this.height / 2);
        this.context.lineTo(this.width / 2, 0);
        this.context.lineTo(-this.width / 2, this.height / 2);
        this.context.lineTo(-(this.width / 2) + 2, 0);
        this.context.closePath();
        this.context.fill();
    }

    isAlive() {
        return this.state != PlayerState.DEAD;
    }
}

