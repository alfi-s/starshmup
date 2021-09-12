import { Pool, Sprite } from "kontra";
import colors from './colors';

export default class Bullet extends Sprite.class {
    init(props) {
        super.init(props);
        this.width = 5;
        this.height = 5;
        if (props) {
            this.damage = props.damage;
        }
    }

    draw() {
        this.context.fillStyle = colors.indigo;
        this.context.beginPath();
        this.context.arc(0, 0, this.width, 0, 2 * Math.PI);
        this.context.closePath();
        this.context.fill();
    }

    isAlive() {
        const canvas = this.context.canvas;
        return this.ttl > 0 && this.x >= 0 && this.x < canvas.width && this.y >= 0 && this.y < canvas.height;
    }
}

export const bulletPool = Pool({
    create: function () { return new Bullet },
    maxSize: 2048
})