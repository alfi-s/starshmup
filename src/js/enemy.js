import { Sprite } from "kontra";

export default class Enemy extends Sprite.class {
    constructor(props) {
        super(props);
        this.health = props.health;
        this.alive = true;
    }

    update() {
        if (this.health <= 0) {
            this.alive = false;
        }
    }

    isAlive() {
        return this.alive;
    }

}