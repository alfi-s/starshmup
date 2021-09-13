import { Sprite } from "kontra";
import { bulletPool } from "./bullet";

export default class Enemy extends Sprite.class {
    constructor(props) {
        super(props);
        this.health = 0;
        this.points = 0;
    }

    dmg(amount) {
        this.health = this.health - amount;
    }

    isAlive() {
        return this.health > 0;
    }
}

export class Tanky extends Enemy {
    constructor(props) {
        super(props)
        this.speed = 0.5
        this.dx = -this.speed;
        this.health = 200;
        this.width = 50;
        this.height = 50;

        this.coolDownMax = 60;
        this.coolDown = this.coolDownMax;
        this.fireTimerMax = 10;
        this.fireTimer = this.fireTimerMax;
        this.fireCounter = 5;
        this.points = 50;
    }

    update() {
        if (this.coolDown == 0) {
            if (this.fireTimer == 0) {
                bulletPool.get({

                    x: this.x + 0.5 * this.width, y: this.y + 0.5 * this.height,
                    width: 10,
                    height: 10,
                    dmg: 10,
                    target: 'player',
                    color: 'red',
                    dx: 2
                })
                bulletPool.get({
                    x: this.x + 0.5 * this.width, y: this.y + 0.5 * this.height,
                    width: 10,
                    height: 10,
                    dmg: 10,
                    target: 'player',
                    color: 'red',
                    dx: -2
                })
                bulletPool.get({
                    x: this.x + 0.5 * this.width, y: this.y + 0.5 * this.height,
                    width: 10,
                    height: 10,
                    dmg: 10,
                    target: 'player',
                    color: 'red',
                    dy: 2, dx: -0.5
                })
                bulletPool.get({

                    x: this.x + 0.5 * this.width, y: this.y + 0.5 * this.height,
                    width: 10,
                    height: 10,
                    dmg: 10,
                    target: 'player',
                    color: 'red',
                    dy: -2, dx: -0.5
                })

                this.fireTimer = this.fireTimerMax;
                this.fireCounter--
            } else {
                this.fireTimer--;
            }
            if (this.fireCounter === 0) {
                this.fireCounter = 5;
                this.coolDown = this.coolDownMax;
            }
        } else {
            this.coolDown--;
        }
        this.advance();
    }
}

export class Sine extends Enemy {
    constructor(props) {
        super(props);
        this.c = this.y;
        this.dx = -this.speed;
        this.t = 0;
        this.health = 20;
        this.anchor = { x: 0.5, y: 0.5 };
        this.width = 15;
        this.height = 15;
        this.points = 10;
    }

    update(dt) {
        this.rotation -= 0.1
        this.t = this.t + dt > 2 * Math.PI ? 0 : this.t + dt;
        this.y = this.amplitude * Math.sin((this.frequency * this.t) + this.angleDisplacement) + this.c;
        this.advance();
    }

    isAlive() {
        return super.isAlive() && this.x > -100;
    }
}

export function spawnSineWave(x, y, n) {
    let wave = [];
    for (let i = 0; i < n; i++) {
        wave.push(new Sine({
            x: x + i * 50, y: y,
            amplitude: 100,
            frequency: 2,
            angleDisplacement: i * 50,
            speed: 1.5,
            color: 'orange'
        }));
    }
    return wave;
}

export class Fighter extends Enemy {
    constructor(props) {
        super(props);
        this.speed = 1;
        this.dx = -this.speed;
        this.health = 60;
        this.width = 30;
        this.height = 30;

        this.coolDownMax = 100;
        this.coolDown = this.coolDownMax;
        this.fireTimerMax = 10;
        this.fireTimer = this.fireTimerMax;
        this.fireCounter = 1;
        this.points = 50;
    }

    update() {
        if (this.coolDown == 0) {
            if (this.fireTimer == 0) {
                bulletPool.get({
                    x: this.x - this.width / 2, y: this.y,
                    width: 10,
                    height: 10,
                    dmg: 10,
                    target: 'player',
                    color: 'red',
                    dx: -4
                })
                bulletPool.get({
                    x: this.x - this.width / 2, y: this.y + this.height,
                    width: 10,
                    height: 10,
                    dmg: 10,
                    target: 'player',
                    color: 'red',
                    dx: -4
                })

                this.fireTimer = this.fireTimerMax;
                this.fireCounter--;
            } else {
                this.fireTimer--;
            }
            if (this.fireCounter === 0) {
                this.fireCounter = 1;
                this.coolDown = this.coolDownMax;
            }
        } else {
            this.coolDown--;
        }
        this.advance();
    }

    draw() {
        this.context.fillStyle = 'orange';
        this.context.beginPath();
        this.context.moveTo(this.width, 0);
        this.context.lineTo(-this.width, this.height / 2);
        this.context.lineTo(this.width, this.height);
        this.context.closePath();
        this.context.fill();
    }
}