const laserSound = new Audio('assets/laser.wav')
const explosionSound = new Audio('assets/explosion.wav')
export function playLaserSound() {
    let cp = laserSound.cloneNode();
    cp.play();
}
export function playExplosionSound() {
    let cp = explosionSound.cloneNode();
    cp.play();
}