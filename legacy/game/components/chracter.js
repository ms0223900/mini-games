import { drawStaticImg } from '../gameLib'
import { checkObjInsideCollideWithWall } from '../gameFunc'
import { tigerIcon } from '../gameObj'
import { canvasSpec } from '../gameConfig'

const g = 10 / 60

export class MoveObj extends drawStaticImg {
  constructor(props) {
    super(props)
    this.speed = { vx: 3, vy: 0.5 }
    this.acceleration = { ax: 0, ay: g, }
    this.wall = {
      x: 0,
      y: 0,
      w: 300,
      h: 600,
    }
  }
  move() {
    this.speed.vx += this.acceleration.ax
    this.speed.vy += this.acceleration.ay
    this.x += this.speed.vx
    this.y += this.speed.vy
  }
}

const wallInit = {
  x: 0,
  y: 0,
  w: 300,
  h: 600,
}

export class WanderingObj extends drawStaticImg {
  constructor({ wall=wallInit, ...props}) {
    super(props)
    this.speed = { vx: 3, vy: 0 }
    this.acceleration = { ax: 0, ay: g, }
    this.wall = wall
    this.wall = {
      ...this.wall,
      b: this.wall.y + this.wall.h,
    }
    this.count = 0
    // this.wanderCondition = 
  }
  move(get) {
     // ??
    const nextPos = { 
      x: this.x + this.speed.vx, 
      y: this.y + this.speed.vy  
    }
    if(get) {
      return nextPos
    } else {
      this.acc()
      this.x = nextPos.x
      this.y = nextPos.y
    }
  }
  acc() {
    this.speed.vx += this.acceleration.ax
    this.speed.vy += this.acceleration.ay
  }
  checkCollide() {
    const newObj = {
      x: this.move('get').x, 
      y: this.move('get').y,
      w: this.w,
      h: this.h,
    }
    return checkObjInsideCollideWithWall(newObj, this.wall)
  }
  wander() {
    const colliderRes = this.checkCollide()
    if(this.y >= this.wall.b) {
      console.log(this.y, this.wall.b)
      this.y = this.wall.b
    } else {
      // console.log(this.speed.vx, this.speed.vy)
      this.speed.vy >= 0 ? this.count += 1 : this.count = 0
      console.log(this.count)
      //多1~2 frame造成加速, 在碰撞後，使用距離補正？
      if(!colliderRes) {
        this.move()
      } else {
        this.x += this.speed.vx 
        this.y += this.speed.vy 
        if(colliderRes.includes('right') || colliderRes.includes('left')) {
          this.speed.vx = this.speed.vx * -1
        }
        if(colliderRes.includes('top') || colliderRes.includes('bottom')) {
          this.speed.vy = this.speed.vy * -1
        }
        // this.move()
      }
    }
  }
  render(ctx) {
    this.wander()
    this.draw(ctx)
  }
}

export const WanderCat = () => ({
  id: 'WanderCat', cloneId: 0,
  OBJ: new WanderingObj({
    x: 40, y: 40,
    width: 60, height: 60,
    imgSrc: tigerIcon,
    wall: {
      ...wallInit,
      w: canvasSpec.width,
      h: canvasSpec.height,
    }
  })  
})