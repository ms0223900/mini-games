export class Game {
  constructor(canvas, myLayers) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.myLayers = myLayers
  }
  render() {
    this.ctx.fillRect(0, 0, 100, 300)
  }
}