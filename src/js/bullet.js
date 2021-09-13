import { Pool, Sprite } from "kontra";
import colors from './colors';

export default class Bullet extends Sprite.class {
    init(props) {
        super.init(props);
        if (props) {
            this.dmg = props.dmg;
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
    maxSize: 1000
})