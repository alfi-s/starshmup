import { Text } from "kontra";

export function scoreUI(score, canvas) {
    return Text({
        text: `Score: ${score}`,
        font: '32px Trebuchet MS',
        color: 'white',
        y: canvas.height - 40,
        x: 10,
        textAlign: 'left'
    })
}

export function livesUI(lives, canvas) {
    return Text({
        text: `Lives: ${lives}`,
        font: '32px Trebuchet MS',
        color: 'white',
        y: canvas.height - 40,
        x: canvas.width - 130,
        textAlign: 'right'
    })
}