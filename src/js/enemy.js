import { Sprite } from "kontra";
import { player } from './gameManager';

export default class Enemy extends Sprite.class {
    constructor(props) {
        super(props);
        this.health = 0;
    }

    dmg(amount) {
        this.health -= amount;
    }

    isAlive() {
        return this.health > 0;
    }
}

export class Simple extends Enemy {
    constructor(props) {
        super(props)
        this.dx = -this.speed;
        this.health = 50;
    }

    update() {
        this.advance();
    }
}

export class SineEnemy extends Enemy {
    constructor(props) {
        super(props);
        this.c = this.y;
        this.dx = -this.speed;
        this.t = 0;
        this.health = 20;
    }

    update(dt) {
        this.t = this.t + dt > 2 * Math.PI ? 0 : this.t + dt;
        this.y = this.amplitude * Math.sin((this.frequency * this.t) + this.angleDisplacement) + this.c;
        this.advance();
        console.log(player.x, player.y)
    }

    isAlive() {
        return super.isAlive() && this.x > -this.width;
    }
}