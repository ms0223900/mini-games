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
  Enemies,
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
import detectRotatingBlock from './rotatingBlock'
import climbRope from './rope'
import moveOnSlope from './slope'
import shake from './shakeFn'
import { enemyShakeAndKnockback } from './enemy'

let UITextBox
window.onload = () => {
  UITextBox = document.getElementById('uiText')
}


const camera = new Camera({ maxWidth: 960, maxHeight: 540 })
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
    
    //rotating blocks
    RotatingLBs.forEach(lb => {
      lb.render(this.ctx, -camera.offsetX, -camera.offsetY)
      const res = detectRotatingBlock(myPlayer, lb)
      res && camera.shake('offsetX')
    })
    
    //myPlayerInit
    myPlayer.attachWall = false
    //solid wall
    WBs.forEach(wb => {
      wb.render(this.ctx, -camera.offsetX, -camera.offsetY)
      const collideRes = checkSolidBlockCollide(myPlayer, wb)
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
    //

    
    //jump through platform type
    myPlayer.render(this.ctx, -camera.offsetX, -camera.offsetY)
    // myPlayer.isInAir = false
    myPlayer.movement = {
      ...myPlayer.movement,
      baseVx: 0,
      baseVy: 0,
    }
    myPlayer.useGravity = true
    myPlayer.attackHitbox.render(this.ctx,  -camera.offsetX, -camera.offsetY)
    // myPlayer.isInAir = true
    platforms.forEach((pf) => {
      pf.render(this.ctx, -camera.offsetX, -camera.offsetY)
      const collideRes = checkPlayerCollideWithPlatform(myPlayer, pf)
      const checkObjCollideWithPlatform = (obj, platform) => {
        const collideRes = checkPlayerCollideWithPlatform(obj, platform)
        if(collideRes) {
          //enemy wonder
          if(obj.isWonderOnPlatform && !obj.wonderingPlatform) {
            obj.setProp('wonderingPlatform', collideRes)
          }
          this.checkNoMoveSets()
          obj.collideWithPlatform(pf.y)
          //moving platform
          if(pf.id === 'movingObj' || pf.id === 'dropPlatform') {
            //temp platform only horizontal movement
            obj.movement = {
              ...obj.movement,
              baseVx: pf.movement.vx,
              baseVy: pf.movement.vy 
            }
            obj.useGravity = false
            obj.whichPF = pf.cloneId
          }
          //timeout dropping platform
          
          if(pf.id === 'dropPlatform') {
            const { dropTime } = pf
            pf.setProp('fillStyle', '#a00')
            //set timer
            // pf.timer = setInterval(() => {
            //   pf.dropTime.timeNow += 1
            // }, 1000)
            !pf.dropTime.timer && pf.setProp('dropTime', {
              ...dropTime,
              timer: setInterval(() => {
                pf.dropTime.timeNow += 1000
              }, 1000)
            }) 
            pf.shake()
            // console.log(pf.dropTime.timer, pf.dropTime.timeNow)
            if(pf.dropTime.timeNow >= pf.dropTime.maxTime) {
              console.log('droping!')
              pf.setProp('fillStyle', '#11a')
              setTimeout(() => {
                pf.setProp('dropTime', {
                  ...dropTime,
                  timeNow: 0,
                })
                pf.setProp('movement', {
                  ...pf.movement,
                  isMove: false,
                  vy: 0
                })
                pf.setProp('y', pf.prevProps.y) //back to origin position
              }, 2500)
              pf.setProp('movement', {
                ...pf.movement,
                isMove: true,
                vy: 3
              })
            }
          }
        } else {
          pf.id === 'dropPlatform' && clearInterval(pf.dropTime.timer)
          pf.setProp('dropTime', {
            ...pf.dropTime,
            timeNow: 0,
            timer: null
          })
        }
      }
      // console.log(collideRes)
        
      if(myPlayer.whichPF === pf.cloneId) { //should detect same platform
        if(!collideRes) {
          myPlayer.whichPF = null
        }
      }
      if(pf.id === 'dropPlatform') {
        pf.setProp('fillStyle', '#9a0')
      }
      
      checkObjCollideWithPlatform(myPlayer, pf)
      Enemies.forEach(en => {
        checkObjCollideWithPlatform(en, pf)
      })

    })
    camera.shake('offsetX')
    Enemies.forEach(enemy => {
      enemy.render(this.ctx, -camera.offsetX, -camera.offsetY)
      //check collide with player hitbox(attack)
      const { direction } = myPlayer
      const { attackHitbox } = myPlayer
      const { wonderingPlatform, direction: enemyDir, x, width } = enemy

      const playerAttackCollistionRes = simpleCheckObjCollide(attackHitbox, enemy)
      if(playerAttackCollistionRes && attackHitbox.display && !enemy.isAttacked) {
        enemyShakeAndKnockback(enemy, camera, direction)
      }
      //wonder movement on platform
      if(wonderingPlatform) {
        const reverse = () => 
          enemy.setProp('movement', {
            ...enemy.movement,
            vx: enemy.movement.vx * -1
          })
        if(enemyDir === 'right' && x + width >= wonderingPlatform.x + wonderingPlatform.width) {
          enemy.setProp('direction', 'left')
          reverse()
        } else if(enemyDir === 'left' && x <= wonderingPlatform.x) {
          enemy.setProp('direction', 'right')
          reverse()
        }
      }
    })
    //
    //test player collide with slope(SL02 case)
    Slopes.forEach(sl => {
      sl.render(this.ctx, -camera.offsetX, -camera.offsetY)
      moveOnSlope(myPlayer, sl)
    })
    //ropes
    Ropes.forEach(rope => {
      rope.render(this.ctx, -camera.offsetX, -camera.offsetY)
      climbRope(myPlayer, rope)
    })


    //camera move defined by player
    camera.updatePos(playerCenter.x, playerCenter.y)
    !this.isPause && requestAnimationFrame( this.render.bind(this) )
  }
}
export default (canvas, canvasSpec) => {
  const game = new DashingGame(canvas, canvasSpec, {})
  clearInterval(game.spawnEnemy)
  return game
}