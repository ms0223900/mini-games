/* eslint-disable no-unused-vars */
import { 
  checkObjInsideCollideWithWall, 
  checkMoveObjCollideWithObj ,
  simpleCheckObjCollide,
} from './gameFunc'
import { canvasSpec } from '../config'
//
export class BasicObj {
  constructor({ id='basicObj', cloneId=0, type='normal', x=0, y=0, width=100, height=100, fillStyle='#111', strokeStyle='#fff', collideObjs=[], movement=null }) {
    this.id = id
    this.cloneId = cloneId
    this.type = type
    //
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.spec = {
      x,
      y,
      w: this.width,
      h: this.height,
    }
    //movement
    this.movement = movement || {
      isMove: false,
      vx: 4,
      vy: 4,
      ax: 0,
      ay: 0,
    }
    this.collideObjs = collideObjs
    //
    this.wall = {
      spec: {
        x: 0,
        y: 0,
        w: canvasSpec.width,
        h: canvasSpec.height,
      }
    }
    this.fillStyle = fillStyle
    this.strokeStyle = strokeStyle
  }
  setProp(prop, value) {
    this[prop] = value
  }
  getWallCollide(wallSpec) {
    this.wall.spec = wallSpec
  }
  move() {
    if(this.movement.isMove) {
      const collideRes = this.wall && checkObjInsideCollideWithWall(this, this.wall)
      if(collideRes) {
        if(collideRes.includes('xAxis')) {
          this.movement = {
            ...this.movement,
            vx: this.movement.vx * -1
          }
        }
        if(collideRes.includes('yAxis')) {
          this.movement = {
            ...this.movement,
            vy: this.movement.vy * -1
          }
        }
      }
      const newX = this.x + this.movement.vx
      const newY = this.y + this.movement.vy
      this.x = newX
      this.y = newY
      this.spec = {
        ...this.spec,
        x: newX,
        y: newY,
      }
    }
  }
  checkCollide() {
    for (let i = 0; i < this.collideObjs.length; i++) {
      if( simpleCheckObjCollide(this, this.collideObjs[i]) ) {
        this.fillStyle = '#a00'
        console.log()
      } else {
        this.fillStyle = '#3a0'
      }
      
    }
  }
  drawOnCanvas(ctx) {
    ctx.save()
    // ctx.beginPath()
    ctx.fillStyle = this.fillStyle
    ctx.strokeStyle = this.strokeStyle
    ctx.fillRect(this.x, this.y, this.width, this.height)
    ctx.stroke()
    ctx.fill()
    // ctx.closePath()
    ctx.restore()
  }
  draw(ctx) {
    this.drawOnCanvas(ctx)
  }
  render(ctx) {
    this.move()
    this.checkCollide()
    this.draw(ctx)
  }
}

export class Ball extends BasicObj {
  constructor({ r=20, ...props }) {
    super(props)
    this.r = r
    this.width = r * 2
    this.height = r * 2
    this.spec = {
      ...this.spec,
      w: this.width,
      h: this.height,
    }
  }
  drawOnCanvas(ctx) {
    ctx.save()
    ctx.fillStyle = this.fillStyle
    ctx.strokeStyle = this.strokeStyle
    ctx.arc(this.x + this.r, this.y + this.r, this.r, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fill()
    ctx.restore()
  }
  draw(ctx) {
    this.drawOnCanvas(ctx)
  }
}

const collidePropInit = {
  type: 'enemy',
  hitDamage: 10,
}
export class collidableObj extends BasicObj {
  constructor({ collideProp=collidePropInit, ...props }) {
    super(props)
    this.collideProp = collideProp
  }
}
//

const myBall = new Ball({ x: 440, y: 40, fillStyle: '#a00' })
myBall.setProp('movement', {
  ...myBall.movement,
  isMove: false,
  vx: -10,
  vy: 10,
})
const myRect = new BasicObj({ x: 200, y: 0, width: 100, height: 100, fillStyle: '#3a0', collideObjs: [myBall] })

const enemy = new BasicObj({ x: 300, y: 100, width: 20, height: 200, fillStyle: '#a90', })
const getNewBullet = (x=0, y=0, newCloneId=0) => new BasicObj({ 
  id: 'bullet', 
  cloneId: newCloneId, 
  x, y, 
  width: 20, 
  height: 20, 
  fillStyle: '#f010ad', 
  movement: {
    isMove: true,
    vx: 10, 
    vy: 0,
  } 
})

// console.log(myBall)

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

export class ControllableObj extends BasicObj {
  constructor(props) {
    super(props)
    this.movement = {
      ...this.movement,
      vStandard: 4,
      vx: 0,
      vy: 0,
      moveSet: [],
    }
    this.moveEvent()
  }
  moveEvent() {
    console.log(this)
    document.addEventListener('keydown', (e) => this.moveByUser(e))
    document.addEventListener('keyup', (e) => {
      const { keyCode } = e
      this.movement.isMove = false
      this.movement.moveSet = this.movement.moveSet.filter(m => m !== e)
    })
  }
  moveByUser(e) {
    const { keyCode } = e
    this.movement.isMove = true
    const getMoveSet = (moveset, keyCode) => {
      if(moveset.includes(keyCode)) {
        return moveset
      } else {
        return [...moveset, keyCode]
      }
    }
    this.movement.moveSet = getMoveSet(this.movement.moveSet, keyCode)
    console.log(this.movement.moveSet)
    //move by keyCode
    if(keyCode === 37) {
      this.movement.vy = 0
      this.movement.vx = this.movement.vStandard * -1
    } else if(keyCode === 38) {
      this.movement.vx = 0
      this.movement.vy = this.movement.vStandard * -1
    } else if(keyCode === 39) {
      this.movement.vy = 0
      this.movement.vx = this.movement.vStandard * 1
      // this.x += 6
    } else if(keyCode === 40) {
      this.movement.vx = 0
      this.movement.vy = this.movement.vStandard * 1
    } else if(keyCode === 32) {
      this.shootBullet()
    }
    console.log(keyCode)
  }
  shootBullet() {

  }
}
const myPlayer = new ControllableObj({
  fillStyle: '#a0a',
  x: 100, y: 100,
  w: 200, h: 200,
})

export class Game {
  constructor(canvas, canvasSpec, gameProp) {
    this.canvas = canvas
    this.canvasSpec = canvasSpec
    this.ctx = canvas.getContext('2d')
    this.gameNewCloneId = 0
    // this.myLayers = myLayers
    this.gameProp = gameProp
    this.frame = { prev: 0, now: 0, fps: 0 }
    this.FPSInit = setInterval(() => {
      this.frame.fps = (this.frame.now - this.frame.prev) * 2
      this.frame.prev = this.frame.now
      // console.log(this.frame)
    }, 500)
    this.newGameObjs = []
    document.addEventListener('keydown', (e) => this.newGameEvent(e))
  }
  setGameProp(prop, value) {
    this.gameProp = {
      ...this.gameProp,
      [prop]: value,
    }
  }
  //
  drawFPS() {
    this.frame.now += 1
    this.ctx.font = '16px Arial'
    this.ctx.fillStyle = '#000'
    this.ctx.fillText('fps:' + this.frame.fps, 10, 20)
  }
  drawBG() {
    this.ctx.save()
    this.ctx.globalAlpha = 0.1
    this.ctx.fillStyle = '#ddd'
    this.ctx.fillRect(0, 0, this.canvasSpec.width, this.canvasSpec.height)
    this.ctx.restore()
  }
  newGameEvent(e) {
    const { keyCode } = e
    if(keyCode === 32) {
      this.newGameObjs = [
        ...this.newGameObjs,
        getNewBullet(myPlayer.x, myPlayer.y, this.gameNewCloneId), 
      ]
      this.gameNewCloneId += 1
      console.log(this.newGameObjs)
    }
  }
  render() {
    this.ctx.clearRect(0, 0, this.canvasSpec.width, this.canvasSpec.height)
    //
    this.ctx.beginPath()
    this.drawBG()
    this.drawFPS()
    enemy.render(this.ctx)
    myRect.render(this.ctx)

    myBall.render(this.ctx)
    for (let i = 0; i < this.newGameObjs.length; i++) {
      const OBJ = this.newGameObjs[i]
      if( simpleCheckObjCollide(OBJ, enemy) ) {
        this.newGameObjs = this.newGameObjs.filter(o => o.cloneId !== OBJ.cloneId)
      } else {
        OBJ.render(this.ctx)
      }
      
    }
    myPlayer.render(this.ctx)
    const collideRes = simpleCheckObjCollide(myBall, myRect)
    if(collideRes) {
      this.setGameProp('score', this.gameProp.score + 1)
      // console.log(this.gameProp.score)
    }
    this.ctx.closePath()

    //animation
    requestAnimationFrame( this.render.bind(this) )
  }
}
const initGameProp = {
  score: 0,
}

export const MyGame = (canvas, canvasSpec) => new Game(canvas, canvasSpec, initGameProp)