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

export const gameOverUI = (canvas) => Text({
    text: `Game Over`,
    font: '100px Trebuchet MS',
    color: 'white',
    anchor: { x: 0.5, y: 0.5 },
    y: canvas.height / 2,
    x: canvas.width / 2,
    textAlign: 'center'
})