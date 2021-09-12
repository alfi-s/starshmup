import { Sprite, keyPressed } from "kontra";
import { bulletPool } from './bullet'
import colors from './colors';

export default class Player extends Sprite.class {
    constructor(props) {
        super(props);
        this.type = 'player';
        this.speedLow = props.speedLow;
        this.speedHigh = props.speedHigh;
        this.bulletTimerMax = props.bulletTimerMax;
        this.bulletTimer = this.bulletTimerMax;
    }

    update() {
        // handle the movement input
        let movementSpeed = keyPressed('shift') ? this.speedLow : this.speedHigh;
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
        this.bulletTimer--;
        if (keyPressed('space') && this.bulletTimer <= 0) {
            bulletPool.get({
                x: this.x,
                y: this.y,
                dx: 14,
                damage: 10
            })
            this.bulletTimer = this.bulletTimerMax;
        }

        this.advance();
    }

    draw() {
        this.context.fillStyle = colors.cyan;
        this.context.beginPath();
        this.context.moveTo(-7, -10);
        this.context.lineTo(15, 0);
        this.context.lineTo(-7, 10);
        this.context.closePath();
        this.context.fill();
    }
}

