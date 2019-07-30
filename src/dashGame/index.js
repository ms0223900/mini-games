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
  SpeedupPlatforms,
  RotatingLBs,
} from './components'
import { 
  checkPlayerCollideWithPlatform,
  checkSolidBlockCollide, 
  checkLineIntersection,
  getDistance,
  objMoveBaseOnLines,
  getVectors,
  checkPointAtLine,
  getObjAllSidesLine,
} from './gameFn'
import { getReverseArr } from '../functions'
import { Camera } from './Camera'
import { simpleCheckObjCollide, getDeg } from '../game/gameFunc'
import springJump from './spring'

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
  checkNoMoveSets() {
    if(myPlayer.movement.moveSet.length === 0) {
      myPlayer.movement = {
        ...myPlayer.movement,
        vx: 0,
      }
    }
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
          // ax: 0,
          vy: 0,
        })
        this.checkNoMoveSets()
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
      
      springJump(myPlayer, spr)
    })
    //
    //speed up platforms
    SpeedupPlatforms.forEach(spf => {
      spf.render(this.ctx, -camera.offsetX, -camera.offsetY)

      const collideRes = checkPlayerCollideWithPlatform(myPlayer, spf)
      // console.log(collideRes)
        
      if(myPlayer.whichSpf === spf.cloneId) { //should detect same platform
        if(!collideRes) {
          myPlayer.whichSpf = null
          myPlayer.setProp('movement', {
            ...myPlayer.movement,
            baseVx: 0
          })
          myPlayer.setProp('movement', {
            ...myPlayer.movement,
            vx: myPlayer.movement.vx + spf.speedUp
          })
        }
      }
      if(collideRes) {
        myPlayer.collideWithPlatform(spf.y)
        //moving platform
        if(spf.id === 'speedUpPlatform') {
          //temp platform only horizontal movement
          myPlayer.setProp('movement', {
            ...myPlayer.movement,
            baseVx: spf.speedUp
          })
          // myPlayer.useGravity = false
          myPlayer.whichSpf = spf.cloneId
        }
      }
    })
    //jump through platform type
    myPlayer.render(this.ctx, -camera.offsetX, -camera.offsetY)
    // myPlayer.isInAir = false
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
        // myPlayer.movement = {
        //   ...myPlayer.movement,
        //   baseVx: 0,
        // }
        this.checkNoMoveSets()
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
    //test player collide with slope(SL02 case)
    const playerSlopePoint = {
      x: myPlayer.x + myPlayer.slopePoint.x,
      y: myPlayer.y + myPlayer.slopePoint.y,
      movement: myPlayer.movement
    }
    const playerSlopePoint_next = { //point B
      x: playerSlopePoint.x + myPlayer.movement.vx,
      y: playerSlopePoint.y + myPlayer.movement.vy,
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
      //
      const pointLineRes_next = checkPointAtLine(playerSlopePoint_next, slopeLine.A, slopeLine.B)
      
      
      const setNewPos_rightOrLeft = () => {
        myPlayer.slopePosUpdate_right = slopeMoveNewPos_right
        myPlayer.slopePosUpdate_left = slopeMoveNewPos_left
        if(!slopeMoveNewPos_right || !slopeMoveNewPos_left) {
          // console.log('falsesss')
          myPlayer.setProp('onSlope', false)
        }
      }
      //
      const checkPointIsAtPoint = () => {
        for (let i = 0; i < SL02.pointsForLines.length; i++) {
          const point = SL02.pointsForLines[i];
          if(point.x === playerSlopePoint.x && point.y === playerSlopePoint.y) {
            // window.alert('hi!')
            console.log(playerSlopePoint)
            // myPlayer.setProp('x', myPlayer.x - 20)
            // setNewPos_rightOrLeft()
            return true
          }
        }
      }
      if(checkPointIsAtPoint()) {
        break
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
        //enter the slope area
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
            // vx: 0,
          })
          setNewPos_rightOrLeft()
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
    RotatingLBs.forEach(lb => {
      const { x, y, height, width } = lb
      lb.render(this.ctx, -camera.offsetX, -camera.offsetY)
      //check collide
      const deg = lb.rotate
      //rotatedBlockPoints(from top left)
      const degCos = getDeg(deg, 'x')
      const degSin = getDeg(deg, 'y')

      const rotatedBlockPoint_A = { x, y }
      const rotatedBlockPoint_B = {
        x: x + degCos * width, 
        y: y + degSin * width,
      }
      const rotatedBlockPoint_C = {
        x: rotatedBlockPoint_B.x - degSin * height,
        y: rotatedBlockPoint_B.y + degCos * height,
      }
      const rotatedBlockPoint_D = {
        x: rotatedBlockPoint_C.x - degCos * width,
        y: rotatedBlockPoint_C.y - degSin * width,
      }
      //
      const rotatedBlockLine_Top = [
        rotatedBlockPoint_A, rotatedBlockPoint_B
      ]
      const rotatedBlockLine_Right = [
        rotatedBlockPoint_B, rotatedBlockPoint_C
      ]
      const rotatedBlockLine_Bottom = [
        rotatedBlockPoint_C, rotatedBlockPoint_D
      ]
      const rotatedBlockLines = [
        rotatedBlockLine_Top, rotatedBlockLine_Right, rotatedBlockLine_Bottom
      ]
      const playerAllSidesLine = getObjAllSidesLine(myPlayer)

      lb.setProp('fillStyle', '#a00')
      for (let i = 0; i < playerAllSidesLine.length; i++) {
        const playerLine = playerAllSidesLine[i]
        for (let j = 0; j < rotatedBlockLines.length; j++) {
          const line = rotatedBlockLines[j];
          if(checkLineIntersection(playerLine, line)) {
            lb.setProp('fillStyle', '#aaa')
            break
          }
        }
      }

      // if(checkLineIntersection(playerTop, rotatedBlockLine_Top)) {
      //   window.alert('hey!')
      // }
    })
    //
    !this.isPause && requestAnimationFrame( this.render.bind(this) )
  }
}
export default (canvas, canvasSpec) => {
  const game = new DashingGame(canvas, canvasSpec, {})
  clearInterval(game.spawnEnemy)
  return game
}