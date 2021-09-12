import { Pool, Sprite } from "kontra";
import colors from './colors';

export default class Bullet extends Sprite.class {
    init(props) {
        super.init(props);
        this.width = 5;
        this.height = 5;
        this.color = colors.indigo;
        if (props) {
            this.damage = props.damage;
            this.target = props.target;
        }
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