import { Pool, Sprite, lerp } from "kontra";
import { playExplosionSound } from "./audio";
import colors from "./colors";

export default class Particle extends Sprite.class {
    constructor(props) {
        super(props);
        if (props) {
            this.opacity = props.opacity;
        } else {
            this.opacity = 1;
        }
    }

    draw() {
        this.context.globalAlpha = this.opacity;
        this.context.fillStyle = this.color;
        this.context.fillRect(0, 0, this.width, this.height);
    }
}

export const particlePool = Pool({
    create: function () { return new Particle },
    maxSize: 1000
})

export const starPool = Pool({
    create: function () { return new Particle },
    maxSize: 100
})
export function explosion(x, y, color, numberOfParticles) {
    playExplosionSound();
    for (let i = 0; i < numberOfParticles; i++) {
        particlePool.get({
            x: x, y: y,
            dx: 4 - Math.random() * 8,
            dy: 4 - Math.random() * 8,
            width: 3,
            height: 3,
            color: color,
            ttl: 50,
            opacity: 0.5,
            life: 0,
            update: function () {
                this.rotation += 0.1
                if (this.opacity) {
                    this.opacity = lerp(0.5, 0, this.life / this.ttl);
                }
                this.life++;
                this.advance();
            }
        })
    }
}

export function initStars(w, h) {
    for (let i = 0; i < 100; i++) {
        starPool.get({
            x: Math.random() * w, y: Math.random() * h,
            dx: -3,
            width: 3,
            height: 3,
            color: Math.random() > 0.5 ? colors.violet : colors.indigo,
            isAlive() {
                return this.x > 0;
            }
        })

    }
}