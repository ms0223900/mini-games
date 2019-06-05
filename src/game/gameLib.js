export class BasicObj {
  constructor({ id='basicObj', cloneId=0, x=0, y=0, width=20, height=20, fillStyle='#111', strokeStyle='#fff' }) {
    this.id = id
    this.cloneId = cloneId
    //
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    //movement
    this.movement = {
      isMove: true,
      vx: 1,
      vy: 2,
      ax: 0,
      ay: 0,
    }
    //
    this.fillStyle = fillStyle
    this.strokeStyle = strokeStyle
  }
  setProp(prop, value) {
    this[prop] = value
  }
  move() {
    if(this.movement.isMove) {
      this.x += this.movement.vx
      this.y += this.movement.vy
    }
  }
  render(ctx) {
    this.move()
    this.draw(ctx)
  }
}

export class Ball extends BasicObj {
  constructor({ r=20, ...props }) {
    super(props)
    this.r = r
    this.width = r * 2
    this.height = r * 2
  }
  drawOnCanvas(ctx) {
    ctx.save()
    ctx.fillStyle = this.fillStyle
    ctx.strokeStyle = this.strokeStyle
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fill()
    ctx.restore()
  }
  draw(ctx) {
    this.drawOnCanvas(ctx)
  }
}

const myBall = new Ball({})
myBall.setProp('movement', {
  isMove: true,
  ...myBall.movement,
})

export class Layer {
  constructor(layerObjs=[]) {
    this.layerObjs = layerObjs
  }
  render(ctx) {
    for (let i = 0; i < this.layerObjs.length; i++) {
      this.layerObjs[i].render(ctx)
    }
  }
}

export class Game {
  constructor(canvas, canvasSpec, gameProp) {
    this.canvas = canvas
    this.canvasSpec = canvasSpec
    this.ctx = canvas.getContext('2d')
    // this.myLayers = myLayers
    this.gameProp = gameProp
    this.frame = { prev: 0, now: 0, fps: 0 }
    this.FPSInit = setInterval(() => {
      this.frame.fps = (this.frame.now - this.frame.prev) * 2
      this.frame.prev = this.frame.now
      // console.log(this.frame)
    }, 500)
  }
  //
  drawFPS() {
    this.frame.now += 1
    this.ctx.font = '16px Arial'
    this.ctx.fillStyle = '#000'
    this.ctx.fillText('fps:' + this.frame.fps, 10, 20)
  }
  drawBG() {
    this.ctx.fillStyle = '#ddd'
    this.ctx.fillRect(0, 0, this.canvasSpec.width, this.canvasSpec.height)
  }
  render() {
    this.ctx.clearRect(0, 0, this.canvasSpec.width, this.canvasSpec.height)
    //
    this.drawBG()
    this.drawFPS()
    myBall.render(this.ctx)
    //animation
    requestAnimationFrame(this.render.bind(this))
  }
}
const initGameProp = {
  score: 0,
}

export const MyGame = (canvas, canvasSpec) => new Game(canvas, canvasSpec, initGameProp)