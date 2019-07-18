/* eslint-disable no-unused-vars */
import {  
  Game
} from '../game/gameLib'
import {  
  PFs,
  WBs,
  Slopes,
  SL01,
  myPlayer,
  B01,
} from './components'
import { 
  checkPlayerCollideWithPlatform,
  checkSolidBlockCollide, 
  checkLineIntersection,
  getDistance,
  objMoveBaseOnLines,
} from './gameFn'
import { getReverseArr } from '../functions'
import { simpleCheckObjCollide } from '../game/gameFunc'

let UITextBox
window.onload = () => {
  UITextBox = document.getElementById('uiText')
}

export function Camera(maxWidth, maxHeight) {
  return ({
    w: maxWidth,
    h: maxHeight,
    originCenterX: maxWidth / 2,
    originCenterY: maxHeight / 2,
    x: maxWidth / 2,
    y: maxHeight / 2,
    vx: 0,
    vy: 0,
    offsetX: 0,
    offsetY: 0,
    updatePos(x, y) {
      if(x >= this.w / 2) {
        this.x = x
        this.offsetX = this.x - this.originCenterX 
      } else {
        this.offsetX = 0
      }
      if(y <= this.h / 2) {
        this.y = y
        this.offsetY = this.y - this.originCenterY
      } else {
        this.offsetY = 0
      }
    },
    move() {
      this.x += this.vx
      this.offsetX = this.x - this.originCenterX
      this.y += this.vy
      this.offsetY = this.y - this.originCenterY
    },
    detectIsOutofBound(obj) {
      if(obj.x < this.x - this.w / 2 || obj.x > this.x + this.w / 2 ||
        obj.y < this.y - this.h / 2 || obj.y > this.y + this.h / 2) {
          return true
        } 
      return false
    }
  })
}
const camera = Camera(960, 540)
//

class DashingGame extends Game {
  constructor(canvas, canvasSpec, initGameProp) {
    super(canvas, canvasSpec, initGameProp)
    this.isPause = false
    // this.camera = Camera(canvasSpec.width, canvasSpec.height)
  }
  newGameEvent(e) {
    myPlayer.moveByUser(e)
  }
  render() {
    this.ctx.clearRect(0, 0, this.canvasSpec.width, this.canvasSpec.height)
    this.drawBG()
    this.drawFPS()
    //
    const platforms = PFs
    const playerCenter = {
      x: myPlayer.x + myPlayer.width / 2,
      y: myPlayer.y + myPlayer.height / 2,
    }
    //camera move defined by player
    camera.updatePos(playerCenter.x, playerCenter.y)
    // camera.vx = 2
    // camera.move()
    // if(camera.detectIsOutofBound(myPlayer)) {
    //   this.isPause = true
    //   window.alert('you die.')
    // }
    // console.log(camera)
    //
    
    myPlayer.attachWall = false
    //solid wall
    WBs.forEach(wb => {
      wb.render(this.ctx, -camera.offsetX, -camera.offsetY)
      const collideRes = checkSolidBlockCollide(myPlayer, wb)
      // console.log(collideRes)
      //collide result
      // if(collideRes) {
      //   myPlayer.movement = {
      //     ...myPlayer.movement,
      //     baseVx: 0,
      //     baseVy: 0,
      //   }
      // }
      if(collideRes === 'bottom' || collideRes === 'top') {
        // myPlayer.attachWall = false
        myPlayer.setProp('movement', {
          ...myPlayer.movement,
          vy: 0,
        })
        collideRes === 'bottom' ? 
          myPlayer.setProp('y', wb.y - myPlayer.height) :
          myPlayer.setProp('y', wb.y + wb.height)
        collideRes === 'bottom' && myPlayer.setProp('isInAir', false)
      } else if(collideRes === 'left' || collideRes === 'right') {
        myPlayer.attachWall = true
        myPlayer.setProp('movement', {
          ...myPlayer.movement,
          vx: 0,
        })
        collideRes === 'left' ? 
          myPlayer.setProp('x', wb.x + wb.width) :
          myPlayer.setProp('x', wb.x - myPlayer.width)
      }
    })
    myPlayer.movement.slopeX = 1
    myPlayer.movement.slopeY = 0
    myPlayer.useGravity = true
    //
    Slopes.forEach(sl => {
      sl.render(this.ctx, -camera.offsetX, -camera.offsetY)
      // const myPlayerBottomLine = [
      //   { x: myPlayer.x, y: myPlayer.y + myPlayer.height },
      //   { x: myPlayer.x + myPlayer.width, y: myPlayer.y + myPlayer.height },
      // ]
      // const collideRes = checkLineIntersection(myPlayerBottomLine, sl.slopeLine)
      // if(collideRes) {
      //   // myPlayer.setProp('x', collideRes.x - myPlayer.width)
      //   myPlayer.setProp('x', collideRes.x - myPlayer.width)
      //   myPlayer.setProp('y', collideRes.y - myPlayer.height)
      //   const slopeBotttom = {
      //     a: { x: sl.x, y: sl.y + sl.height },
      //     b: { x: sl.x + sl.width, y: sl.y + sl.height }
      //   }
      //   const slopeSide = {
      //     a: { x: sl.x + sl.width, y: sl.y },
      //     b: { x: sl.x + sl.width, y: sl.y + sl.height }
      //   }
      //   const slopeXRatio = getDistance(slopeBotttom.a, slopeBotttom.b) / getDistance(sl.slopeLine[0], sl.slopeLine[1])
      //   const slopeYRatio = getDistance(slopeSide.a, slopeSide.b) / getDistance(sl.slopeLine[0], sl.slopeLine[1])
      //   //
      //   myPlayer.setProp('movement', {
      //     ...myPlayer.movement,
      //     // vy: 0,
      //     slopeX: slopeXRatio, 
      //     slopeY: slopeYRatio,
      //   })
      //   // myPlayer.isInAir = false
      //   myPlayer.useGravity = false
      // }
    })
    //
    //jump through platform type
    myPlayer.render(this.ctx, -camera.offsetX, -camera.offsetY)
    myPlayer.movement = {
      ...myPlayer.movement,
      baseVx: 0,
      baseVy: 0,
    }
    platforms.forEach(pf => {
      pf.render(this.ctx, -camera.offsetX, -camera.offsetY)
      const collideRes = checkPlayerCollideWithPlatform(myPlayer, pf)
      // console.log(collideRes)
      if(collideRes) {
        myPlayer.collideWithPlatform(pf.y)
        //moving platform
        if(pf.id === 'movingPlatform') {
          //temp platform only horizontal movement
          myPlayer.movement = {
            ...myPlayer.movement,
            baseVx: pf.movement.vx,
            baseVy: pf.movement.vy
          }
        }
      }
    })
    //ball test
    const ballNewPos = objMoveBaseOnLines(B01, SL01.pointsForLines)
    if(ballNewPos) {
      B01.setProp('x', ballNewPos.x)
      B01.setProp('y', ballNewPos.y)
    } else {
      const lastPoint = SL01.pointsForLines[SL01.pointsForLines.length - 1]
      // B01.setProp('x', lastPoint.x)
      // B01.setProp('y', lastPoint.y)
      SL01.setProp('pointsForLines', getReverseArr(SL01.pointsForLines))
    }
    B01.render(this.ctx, -camera.offsetX, -camera.offsetY)
    //
    !this.isPause && requestAnimationFrame( this.render.bind(this) )
  }
}
export default (canvas, canvasSpec) => {
  const game = new DashingGame(canvas, canvasSpec, {})
  clearInterval(game.spawnEnemy)
  return game
}