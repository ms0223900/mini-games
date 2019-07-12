/* eslint-disable no-unused-vars */
import {  
  Game
} from '../game/gameLib'
import {  
  PFs,
  WBs,
  myPlayer,
} from './components'
import { 
  checkPlayerCollideWithPlatform,
  checkSolidBlockCollide, 
} from './gameFn'
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
    }
  })
}

const camera = Camera(960, 540)

class DashingGame extends Game {
  constructor(canvas, canvasSpec, initGameProp) {
    super(canvas, canvasSpec, initGameProp)
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
    camera.updatePos(playerCenter.x, playerCenter.y)
    // console.log(camera)
    //
    //
    //jump through platform type
    platforms.forEach(pf => {
      pf.render(this.ctx, -camera.offsetX, -camera.offsetY)
      const collideRes = checkPlayerCollideWithPlatform(myPlayer, pf)
      // console.log(collideRes)
      if(collideRes) {
        if(UITextBox) {
          UITextBox.innerText = collideRes
        }
        myPlayer.collideWithPlatform(pf.y)
      }
    })

    myPlayer.attachWall = false
    //solid wall
    WBs.forEach(wb => {
      wb.render(this.ctx, -camera.offsetX, -camera.offsetY)
      const collideRes = checkSolidBlockCollide(myPlayer, wb)
      // console.log(collideRes)
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
    myPlayer.render(this.ctx, -camera.offsetX, -camera.offsetY)
    
    
    requestAnimationFrame( this.render.bind(this) )
  }
}
export default (canvas, canvasSpec) => {
  const game = new DashingGame(canvas, canvasSpec, {})
  clearInterval(game.spawnEnemy)
  return game
}