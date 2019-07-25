/* eslint-disable no-unused-vars */
import {  
  Game
} from '../game/gameLib'
import {  
  PFs,
  WBs,
  Slopes,
  SL01,
  SL02,
  Ropes,
  myPlayer,
  B01,
  Springs,
} from './components'
import { 
  checkPlayerCollideWithPlatform,
  checkSolidBlockCollide, 
  checkLineIntersection,
  getDistance,
  objMoveBaseOnLines,
  getVectors,
  checkPointAtLine,
} from './gameFn'
import { getReverseArr } from '../functions'
import { Camera } from './Camera'
import { simpleCheckObjCollide } from '../game/gameFunc'

let UITextBox
window.onload = () => {
  UITextBox = document.getElementById('uiText')
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
    
    //myPlayerInit
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
    // myPlayer.movement.slopeY = 0
    
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
    //springs
    Springs.forEach(spr => {
      spr.render(this.ctx, -camera.offsetX, -camera.offsetY)
      if(checkPlayerCollideWithPlatform(myPlayer, spr)) {
        myPlayer.isInSpring = true
      }
      const playerNext = {
        spec: {
          ...myPlayer.spec,
          x: myPlayer.x + myPlayer.movement.vx,
          y: myPlayer.y + myPlayer.movement.vy,
        }
      }
      const checkPlayPosAndSpring = () => (
        myPlayer.y + myPlayer.height > spr.y + spr.height * 0.25
      )
      if(myPlayer.isInSpring && simpleCheckObjCollide(playerNext, spr)) {
        myPlayer.setProp('movement', {
          ...myPlayer.movement,
          ay: -0.5
        })
        myPlayer.isInAir = false
      } else if(myPlayer.isInSpring && !simpleCheckObjCollide(myPlayer, spr)) {
        myPlayer.isInSpring = false
        myPlayer.setProp('movement', {
          ...myPlayer.movement,
          ay: myPlayer.gravityAy,
        })
      }
      
    })
    //
    //jump through platform type
    myPlayer.render(this.ctx, -camera.offsetX, -camera.offsetY)
    myPlayer.movement = {
      ...myPlayer.movement,
      baseVx: 0,
      baseVy: 0,
    }
    myPlayer.useGravity = true
    // myPlayer.isInAir = true
    platforms.forEach((pf) => {
      pf.render(this.ctx, -camera.offsetX, -camera.offsetY)
      const collideRes = checkPlayerCollideWithPlatform(myPlayer, pf)
      // console.log(collideRes)
        
      if(myPlayer.whichPF === pf.cloneId) { //should detect same platform
        if(!collideRes) {
          myPlayer.whichPF = null
        }
      }
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
          myPlayer.useGravity = false
          myPlayer.whichPF = pf.cloneId
        }
      }
    })
    //ball test
    // const ballNewPos = objMoveBaseOnLines(B01, SL01.pointsForLines)
    // if(ballNewPos) {
    //   B01.setProp('x', ballNewPos.x)
    //   B01.setProp('y', ballNewPos.y)
    // } else {
    //   const lastPoint = SL01.pointsForLines[SL01.pointsForLines.length - 1]
    //   // B01.setProp('x', lastPoint.x)
    //   // B01.setProp('y', lastPoint.y)
    //   SL01.setProp('pointsForLines', getReverseArr(SL01.pointsForLines))
    // }
    //
    //test player collide with slope
      const playerSlopePoint = {
        x: myPlayer.x + myPlayer.slopePoint.x,
        y: myPlayer.y + myPlayer.slopePoint.y,
        movement: myPlayer.movement
      }
    const playerSlopePoint_next = { //point B
      x: myPlayer.x + myPlayer.slopePoint.x + myPlayer.movement.vx,
      y: myPlayer.y + myPlayer.slopePoint.y + myPlayer.movement.vy,
    }
    const playerSlopePoints = [playerSlopePoint, playerSlopePoint_next]
    const slopeLines = getVectors(SL02.pointsForLines)
    for (let i = 0; i < slopeLines.length; i++) {
      const slopeLine = slopeLines[i];
      const res = checkLineIntersection(playerSlopePoints, [slopeLine.A, slopeLine.B])
      const pointLineRes = checkPointAtLine(playerSlopePoint, slopeLine.A, slopeLine.B)
      //
      const slopeMoveNewPos_right = objMoveBaseOnLines(playerSlopePoint, SL02.pointsForLines)
      const slopeMoveNewPos_left = objMoveBaseOnLines(playerSlopePoint, getReverseArr(SL02.pointsForLines))
      
      const setNewPos_rightOrLeft = () => {
        myPlayer.slopePosUpdate_right = slopeMoveNewPos_right
        myPlayer.slopePosUpdate_left = slopeMoveNewPos_left
        if(!slopeMoveNewPos_right || !slopeMoveNewPos_left) {
          // console.log('falsesss')
          myPlayer.setProp('onSlope', false)
        }
      }
      //剛好在末端附近(是onSlope, 但是往左或往右沒有值)
      if((!slopeMoveNewPos_right || !slopeMoveNewPos_left) && myPlayer.onSlope) {
        console.log(myPlayer.x)
        setNewPos_rightOrLeft()
        break
      }
      if((pointLineRes && myPlayer.onSlope)) {
        // console.log(i, 'a')
        // console.log(myPlayer.x + myPlayer.slopePoint.x, myPlayer.y + myPlayer.slopePoint.y, SL02.pointsForLines)
        setNewPos_rightOrLeft()
        break 
      } else {
        if(res) {
          // window.alert('collide')
          // console.log(i, 'b')
          myPlayer.setProp('x', res.x - myPlayer.slopePoint.x)
          myPlayer.setProp('y', res.y - myPlayer.slopePoint.y)
          myPlayer.setProp('movement', {
            ...myPlayer.movement,
            vy: 0,
            vx: 0,
            // ay: 0,
          })
          setNewPos_rightOrLeft()
          //
          // console.log(myPlayer.slopePosUpdate_right)
          myPlayer.setProp('isInAir', false)
          myPlayer.setProp('onSlope', true)

          // myPlayer.setProp('useGravity', false)
          break
        }
        
      }
    }
    //ropes
    Ropes.forEach(rope => {
      rope.render(this.ctx, -camera.offsetX, -camera.offsetY)
      const playerCenter = {
        spec: {
          x: myPlayer.x + myPlayer.width / 2,
          y: myPlayer.y,
          w: 0,
          h: myPlayer.height,
        }
      }
      if(simpleCheckObjCollide(playerCenter, rope)) {
        myPlayer.attachRope = true
        myPlayer.ropePosX = rope.x + rope.width / 2 - myPlayer.width / 2
      } else {
        myPlayer.attachRope = false
        myPlayer.onRope = false
      }
    })
    // console.log(myPlayer.attachRope)

    

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