/* eslint-disable no-unused-vars */
import iconImg from '../images/iconImg.png'
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
    return this
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
    ctx.beginPath()
    this.move()
    this.checkCollide()
    this.draw(ctx)
    ctx.closePath()
  }
}

export class BasicStaticImgObj extends BasicObj {
  constructor({ opacity=1, imgSrc, ...props }) {
    super(props)
    this.opacity = opacity
    this.imgSrc = imgSrc
    this.image = new Image()
    this.image.src = this.imgSrc
  }
  drawOnCanvas(ctx) {
    // if(this.bounceStart) { this.bounceLoop() }
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.drawImage(
      this.image, 
      this.x, 
      this.y, 
      this.width, 
      this.height
    )
    ctx.restore()
  }
}

export class BasicText {
  constructor({ id='text', cloneId=0, x=0, y=0, text='default text', textConfig='16px roboto', width=100, height=100, fillStyle='#111', strokeStyle='#fff', movement=null }) {
    this.id = id
    this.cloneId = cloneId
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
    //
    this.text = text
    this.textConfig = textConfig
    this.fillStyle = fillStyle
    this.strokeStyle = strokeStyle
    //movement
    this.movement = movement || {
      isMove: false,
      vx: 4,
      vy: 4,
      ax: 0,
      ay: 0,
    }
    this.propsForUpdate = []
    this.updateRules = []
    this.prevProps = {}
  }
  setProp(prop, value) {
    this[prop] = value
    this.checkUpdateProp()
    this.prevProps[prop] = value
    return this
  }
  addUpdateRule(ruleFn) {
    this.updateRules = [
      ...this.updateRules,
      ruleFn
    ]
    ruleFn(this)
    return this
  }
  addPropForUpdate(prop) {
    this.propsForUpdate = [
      ...this.propsForUpdate,
      prop
    ]
    return this
  }
  checkUpdateProp() {
    for (let i = 0; i < this.propsForUpdate.length; i++) {
      const prop = this.propsForUpdate[i]
      if( this[prop] !== this.prevProps[prop]) {
        for (let j = 0; j < this.updateRules.length; j++) {
          this.updateRules[j](this)
        }
      }
    }
  }
  //
  drawOnCanvas(ctx) {
    ctx.save()
    ctx.font = this.textConfig
    ctx.fillStyle = this.fillStyle
    ctx.fillText(this.text, this.x, this.y)
    ctx.restore()
  }
  draw(ctx) {
    this.drawOnCanvas(ctx)
  }
  render(ctx) {
    
    this.draw(ctx)
  }
}

export class WanderObj extends BasicObj {
  constructor() {
    super()
    this.movement = {
      ...this.movement,
      isMove: true,
    }
    this.wanderSpec = {
      wanderCount: 0,
      wanderMax: 20,
    }
  }
  wander() {
    // if()
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
//-----------------------
//custom components
const myBall = new Ball({ x: 440, y: 40, fillStyle: '#a00' })
myBall.setProp('movement', {
  ...myBall.movement,
  isMove: false,
  vx: -10,
  vy: 10,
})
// const myRect = new BasicObj({ x: 200, y: 0, width: 100, height: 100, fillStyle: '#3a0', collideObjs: [myBall] })
const enemy = (x=300, y=300, newCloneId=0) => 
  new BasicObj({ x, y, id: 'enemy', cloneId: newCloneId, width: 60, height: 60, fillStyle: '#a90', })
const getNewBullet = (x=0, y=0, newCloneId=0) => new Ball({ 
  id: 'bullet', 
  cloneId: newCloneId, 
  x, y, 
  r: 10,
  fillStyle: '#f010ad', 
  movement: {
    isMove: true,
    vx: 10, 
    vy: 0,
  } 
})
//score text
const scoreText = new BasicText({ x: 400, y: 20, text: '', fillStyle: '#1a0' })
scoreText
  .setProp('score', 0)
  .setProp('basicTxt', 'score: ')
  .addUpdateRule((e) => {
    e.text = e.basicTxt + e.score
  })
  .addPropForUpdate('score')
const healthText = new BasicText({ x: 100, y: 20, text: '', fillStyle: '#a00' })
  healthText
    .setProp('health', 10)
    .setProp('basicTxt', 'health: ')
    .addUpdateRule((e) => {
      e.text = e.basicTxt + e.health
    })
    .addPropForUpdate('health')
console.log(scoreText)



// console.log(myBall)

export class Layer {
  constructor(layerObjs=[]) {
    this.layerObjs = layerObjs
  }
  addObjToLayer(obj) {
    this.layerObjs = [...this.layerObjs, obj]
  }
  render(ctx) {
    for (let i = 0; i < this.layerObjs.length; i++) {
      this.layerObjs[i].render(ctx)
    }
  }
}

const UILayer = () => new Layer()

export class ControllableObj extends BasicStaticImgObj {
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
    // console.log(this)
    document.addEventListener('keydown', (e) => this.moveByUser(e))
    document.addEventListener('keyup', (e) => {
      const { keyCode } = e
      this.movement.isMove = false
      // this.movement.moveSet = this.movement.moveSet.filter(m => m !== e)
    })
  }
  moveByUser(e) {
    const { keyCode } = e
    if([37, 38, 39, 40].includes(keyCode)) {
      this.movement.isMove = true
    }
    // const getMoveSet = (moveset, keyCode) => {
    //   if(moveset.includes(keyCode)) {
    //     return moveset
    //   } else {
    //     return [...moveset, keyCode]
    //   }
    // }
    // this.movement.moveSet = getMoveSet(this.movement.moveSet, keyCode)
    // console.log(this.movement.moveSet)
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
    }
    // console.log(keyCode)
  }
}
const myPlayer = new ControllableObj({
  // fillStyle: '#a0a',
  imgSrc: iconImg,
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
    //
    this.newGameObjs = []
    this.gameEnemies = []
    this.spawnEnemy = setInterval(() => this.spawnEnemyFn(), 2000)
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
        getNewBullet(myPlayer.x, myPlayer.y + myPlayer.height / 2, this.gameNewCloneId), 
      ]
      this.gameNewCloneId += 1
      console.log(this.newGameObjs)
    }
  }
  spawnEnemyFn() {
    console.log(this.gameEnemies)
    this.gameEnemies = [
      ...this.gameEnemies,
      enemy(300, 300, this.gameNewCloneId)
        .setProp('movement', {
          ...enemy().movement,
          isMove: true,
          vx: 3,
          vy: 3,
        })
    ]
    this.gameNewCloneId += 1
  }
  render() {
    this.ctx.clearRect(0, 0, this.canvasSpec.width, this.canvasSpec.height)
    //
    this.ctx.beginPath()
    this.drawBG()
    this.drawFPS()

    //game rule
    this.gameEnemies.forEach(e => e.render(this.ctx))
    this.newGameObjs.forEach(e => e.render(this.ctx))
    myPlayer.render(this.ctx)
    scoreText.render(this.ctx)
    healthText.render(this.ctx)
    //check bullets and ememies
    for (let i = 0; i < this.newGameObjs.length; i++) {
      const OBJ = this.newGameObjs[i]
      for (let j = 0; j < this.gameEnemies.length; j++) {
        const enemy = this.gameEnemies[j]
         // if bullet is collided
        if( simpleCheckObjCollide(OBJ, enemy) ) {
          this.gameProp = {
            ...this.gameProp,
            score: typeof(this.gameProp.score) === 'number' ? this.gameProp.score + 100 : 0
          }
          scoreText.setProp('score', this.gameProp.score)
          this.gameEnemies = this.gameEnemies.filter(o => o.cloneId !== enemy.cloneId)
          this.newGameObjs = this.newGameObjs.filter(o => o.cloneId !== OBJ.cloneId)
        }
        // OBJ.render(this.ctx)
      }
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