/* eslint-disable no-unused-vars */
import { 
  checkObjInsideCollideWithWall, 
  checkMoveObjCollideWithObj ,
  simpleCheckObjCollide,
} from './gameFunc'
import { spawnEnemyFrequency } from '../shootingGame/levelConfig'
import { canvasSpec } from '../config'
//

const initBlink = {
  useBlink: false,
  blinkNow: false, //if false it is translucent
  blinkCount: 0,
  blinkMax: 30,
  blinkInterval: 5,
}

export class BasicObj {
  constructor({ 
    id='basicObj', cloneId=0, type='normal', health=3,
    x=0, y=0, width=100, height=100, 
    rotate=0, zoomRatio=1,
    fillStyle='#111', strokeStyle='#fff', opacity=1, 
    collideObjs=[], 
    movement=null, 
    useWall=false, 
    hitbox=null 
  }) {
    //basic info
    this.id = id
    this.cloneId = cloneId
    this.type = type
    this.health = health
    //
    this.zoomRatio = zoomRatio //origin is top left
    this.x = x
    this.y = y
    this.width = width * this.zoomRatio
    this.height = height * this.zoomRatio
    this.rotate = rotate
    //
    this.dev = false
    this.hitbox = hitbox || {
      w: this.width,
      h: this.height,
    }
    this.hitboxOffset = {
      x: (this.width - this.hitbox.w) / 2,
      y: (this.height - this.hitbox.h) / 2,
    }
    this.spec = {
      x: this.x + this.hitboxOffset.x,
      y: this.y + this.hitboxOffset.y,
      w: this.hitbox.w,
      h: this.hitbox.h
    }
    //movement
    this.movement = movement || {
      isMove: false,
      vBasic: 6,
      vx: 4,
      vy: 4,
      ax: 0,
      ay: 0,
    }
    this.newBehavior = []
    this.collideObjs = collideObjs
    //
    this.wall = {
      useWall,
      useBounce: true,
      spec: {
        x: 0,
        y: 0,
        w: canvasSpec.width,
        h: canvasSpec.height,
      }
    }
    this.fillStyle = fillStyle
    this.strokeStyle = strokeStyle
    this.opacity = opacity
    this.blinkSpec = initBlink
  }
  setProp(prop, value) {
    this[prop] = value
    if(prop === 'x' || prop === 'y' || prop === 'width' || prop === 'height') {
      const { x, y, w, h } = this.spec
      if(prop === 'height') {
        this.updateSpec(x, y, w, value)
      }
      if(prop === 'width') {
        this.updateSpec(x, y, value, h)
      }
      if(prop === 'x') {
        this.updateSpec(value, y, w, h)
      }
      if(prop === 'y') {
        this.updateSpec(x, value, w, h)
      }
      //
    }
    return this
  }
  getWallCollide(wallSpec) {
    this.wall.spec = wallSpec
  }
  wallBounce() {
    if(this.wall.useWall) {
      const collideRes = this.wall && checkObjInsideCollideWithWall(this, this.wall)
      if(collideRes) {
        if(collideRes.includes('xAxis')) {
          // this.x < this.wall.spec.w / 2 ?
          //   this.setProp('x', this.wall.spec.w - this.width - 10) :
          //   this.setProp('x', 1)
          this.x < this.wall.spec.w / 2 && this.setProp('x', 1)
          this.movement = {
            ...this.movement,
            vx: this.wall.useBounce ? this.movement.vx * -1 : this.movement.vx
          }
        }
        //
        if(collideRes.includes('yAxis')) {
          this.movement = {
            ...this.movement,
            vy: this.wall.useBounce ? this.movement.vy * -1 : 0
          }
          // this.y < this.wall.spec.h / 2 ? 
          //   this.setProp('y', 1) : 
          //   this.setProp('y', this.wall.spec.h - this.height)
          // //
          // this.setProp('isInAir', false)
        }
      }
    }
  }
  updateSpec(x, y, w, h=this.h) {
    // console.log(x, y, w, h)
    this.spec = {
      x: x + this.hitboxOffset.x,
      y: y + this.hitboxOffset.y,
      w: w || this.spec.w, 
      h: h || this.spec.h,
    }
  }
  move() {
    const { vx, vy, ay } = this.movement
    this.newBehavior.forEach(b => b(this))
    if(this.movement.isMove) {
      this.wallBounce()
      if(this.useGravity) {
        this.movement.vy += ay
      }
      //
      const newX = this.x + vx
      const newY = this.y + vy
      this.x = newX
      this.y = newY
      this.updateSpec(newX, newY)
    }
  }
  blinkEffect() {
    const { blinkNow, blinkCount, blinkMax, blinkInterval } = this.blinkSpec
    if(blinkCount <= blinkMax) {
      this.blinkSpec.blinkCount += 1
      if(blinkCount % blinkInterval === 0) {
        this.blinkSpec.blinkNow = !blinkNow
        this.opacity = 1
      } else if(!blinkNow) {
        this.opacity = 0.5
      }
    } else {
      this.blinkSpec = initBlink
    }
  }
  drawOnCanvas(ctx, x, y) {
    ctx.save()
    ctx.fillStyle = this.fillStyle
    ctx.strokeStyle = this.strokeStyle
    ctx.fillRect(x, y, this.width, this.height)
    ctx.stroke()
    ctx.fill()
    ctx.restore()
  }
  draw(ctx, x=0, y=0) {
    ctx.save()
    ctx.beginPath()
    ctx.globalAlpha = this.opacity
    //translate canvas center
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotate * Math.PI / 180)
    if(this.blinkSpec.useBlink) {
      this.blinkEffect(ctx)
    }
    this.drawOnCanvas(ctx, x, y)
    ctx.closePath()
    ctx.restore()
  }
  render(ctx, x, y) {
    this.move()
    // this.checkCollide()
    this.draw(ctx, x, y)
  }
}

export class BasicStaticImgObj extends BasicObj {
  constructor({ opacity=1, imgSrc, status, ...props }) {
    super(props)
    this.opacity = opacity
    this.statusNow = 'default'
    this.status = status || {
      default: imgSrc,
    }
    this.imgSrc = imgSrc
    this.image = new Image()
    this.image.src = this.imgSrc
  }
  drawOnCanvas(ctx, x, y) {
    const { w, h } = this.spec
    const statusNow = this.statusNow
    const imgNow = this.status[statusNow]
    // if(this.bounceStart) { this.bounceLoop() }
    this.image.src = imgNow
    ctx.save()                              
    ctx.drawImage(
      this.image, 
      0, //due to translate
      0, 
      this.width, 
      this.height
    )
    if(this.dev) {
      ctx.fillRect(x, y, w, h)
    }
    ctx.restore()
  }
}

export class Enemy extends BasicStaticImgObj {
  constructor({ timerAttackFn=() => console.log('attack'), attackTime=1300, ...props }) {
    super(props)
    this.turnDegNow = 0
    this.attackTime = attackTime
    this.timerAttackInit = () => setInterval(() => {
      timerAttackFn(this)
      this.statusNow = this.status.attack ? 'attack' : 'default'
      setTimeout(() => {
        this.statusNow = 'default'
      }, 500)
    }, this.attackTime)
    this.timerAttack = this.timerAttackInit()
  }
  checkIsAlive() {
    if(this.health <= 0) {
      // console.log('clear')
      clearInterval(this.timerAttack)
    }
  }
  setNewMovement(fn) {
    this.newBehavior = [
      ...this.newBehavior,
      fn //(e) => {}
    ]
    return this
  }
}


export class BasicText {
  constructor({ id='text', cloneId=0, x=0, y=0, text='default text', textConfig='16px roboto', textAlign='start', width=100, height=100, fillStyle='#111', strokeStyle='#fff', movement=null }) {
    this.id = id
    this.cloneId = cloneId
    this.display = true
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
    this.textAlign = textAlign
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
    ctx.textAlign = this.textAlign
    ctx.fillStyle = this.fillStyle
    ctx.fillText(this.text, this.x, this.y)
    ctx.restore()
  }
  draw(ctx) {
    this.drawOnCanvas(ctx)
  }
  render(ctx) {
    if(this.display) {
      this.draw(ctx)
    }
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

export class DashPlayer extends BasicObj {

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
    ctx.arc(0 + this.r, 0 + this.r, this.r, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fill()
    ctx.restore()
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
// const myBall = new Ball({ x: 440, y: 40, fillStyle: '#a00' })
// myBall.setProp('movement', {
//   ...myBall.movement,
//   isMove: false,
//   vx: -10,
//   vy: 10,
// })
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
// const scoreText = new BasicText({ x: 400, y: 20, text: '', fillStyle: '#1a0' })
// scoreText
//   .setProp('score', 0)
//   .setProp('basicTxt', 'score: ')
//   .addUpdateRule((e) => {
//     e.text = e.basicTxt + e.score
//   })
//   .addPropForUpdate('score')
// const healthText = new BasicText({ x: 100, y: 20, text: '', fillStyle: '#a00' })
//   healthText
//     .setProp('health', 10)
//     .setProp('basicTxt', 'health: ')
//     .addUpdateRule((e) => {
//       e.text = e.basicTxt + e.health
//     })
//     .addPropForUpdate('health')
// console.log(scoreText)



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
      vStandard: 6,
      vx: 0,
      vy: 0,
      ay: 0.15, //gravity
      moveSet: [],
    }
    this.isInAir = false
    this.useGravity = true
    this.attackType = 'default'
    //
    this.noHurt = false
    this.endNoHurt = () => setTimeout(() => {
      this.noHurt = false
    }, 500)
    //
    this.timeLimitBuff = {
      buffTime: 0,
      buff: false,
    }
    this.checkLimitBuff = setInterval(() => {
      const { buffTime, buff } = this.timeLimitBuff
      if(buffTime > 0) {
        this.timeLimitBuff.buffTime -= 1
      }
      if(buff && this.timeLimitBuff.buffTime === 0) {
        this.timeLimitBuff.buff = false
        this.attackType = 'default'
        this.statusNow = 'default'
      }
    }, 1000)
    this.moveEvent()
  }
  moveEvent() {
    // console.log(this)
    // document.addEventListener('keydown', (e) => this.moveByUser(e))
    document.addEventListener('keyup', (e) => {
      const { keyCode } = e
      // this.movement.isMove = false
      const { moveSet } = this.movement
      this.movement.moveSet = moveSet.filter(m => m !== keyCode)
      if(this.movement.moveSet.length === 0) {
        this.movement = {
          ...this.movement,
          vx: 0,
          vy: this.isInAir ? this.movement.vy / 2 : 0,
        }
      }
    })
  }
  moveByUser(e) {
    const { keyCode } = e
    if([37, 38, 39, 40, 65, 87, 68, 83].includes(keyCode)) {
      this.movement.isMove = true
    }
    const getMoveSet = (moveset, keyCode) => {
      if(moveset.includes(keyCode)) {
        return moveset
      } else {
        return [...moveset, keyCode]
      }
    }
    this.movement.moveSet = getMoveSet(this.movement.moveSet, keyCode)
    const checkMoveSet = (keyCode) => this.movement.moveSet.includes(keyCode)
    // console.log(this.movement.moveSet)
    //move by keyCode
    if(checkMoveSet(37) || checkMoveSet(65)) {
      console.log('left')
      // this.movement.vy = 0
      this.movement.vx = this.movement.vStandard * -1
    }  
    if(checkMoveSet(39) || checkMoveSet(68)) {
      // this.movement.vy = 0
      this.movement.vx = this.movement.vStandard * 1
      // this.x += 6
    }
    if(checkMoveSet(38) || checkMoveSet(87)) {
      // console.log('up')
      // this.movement.vx = 0
      if(this.useGravity) {
        if(!this.isInAir) {
          console.log('up')
          this.movement.vy = this.movement.vStandard * -1
        }
        this.setProp('isInAir', true)
      } else {
        this.movement.vy = this.movement.vStandard * -1
      }
    }
    if(checkMoveSet(40) || checkMoveSet(83)) {
      console.log('down')
      // this.movement.vx = 0
      this.movement.vy = this.movement.vStandard * 1
    }
    // console.log(keyCode)
  }
  collideWithPlatform(platformY) {
    this.setProp('movement', {
      ...this.movement,
      vy: 0,
    })
    this.setProp('y', platformY - this.height)
    this.setProp('isInAir', false)
  }
}
export class GroupObjs {
  constructor({ groupObjs=[], updateFns=[] }) {
    this.display = true
    this.groupObjs = groupObjs
    this.updateFns = updateFns
  }
  setProp(prop, value) {
    this[prop] = value
  }
  render(ctx) {
    if(this.display) {
      this.updateFns.forEach(fn => { fn(this) })
      this.groupObjs.forEach(obj => { obj.render(ctx) })
    }
  }
}




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
    this.spawnEnemyRate = spawnEnemyFrequency
    this.spawnEnemyInterval = () => setInterval(() => this.spawnEnemyFn(), this.spawnEnemyRate)
    this.spawnEnemy = this.spawnEnemyInterval()
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
    
    requestAnimationFrame( this.render.bind(this) )
  }
}
const initGameProp = {
  score: 0,
}

export const MyGame = (canvas, canvasSpec) => new Game(canvas, canvasSpec, initGameProp)