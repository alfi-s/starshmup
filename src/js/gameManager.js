import Player from "./player";
import { bulletPool } from './bullet';



export let enemies = [];

export default class GameManager {
    constructor(canvas) {
        this.player = new Player({
            x: 100,
            y: canvas.height / 2,
            width: 15,
            height: 7,
            speedHigh: 4,
            speedLow: 2,
            bulletTimerMax: 5
        });
        this.enemies = [];
        this.bulletPool = bulletPool;
    }
}