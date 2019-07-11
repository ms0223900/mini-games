import {  
  Game
} from '../game/gameLib'
import {  
  PFs,
  myPlayer,
} from './components'
import { checkPlayerCollideWithPlatform } from './gameFn'

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
    console.log(camera)
    //
    //
    //jump through platform type
    platforms.forEach(pf => {
      pf.render(this.ctx, -camera.offsetX, -camera.offsetY)
      const collideRes = checkPlayerCollideWithPlatform(myPlayer, pf)
      if(collideRes) {
        if(UITextBox) {
          UITextBox.innerText = collideRes
        }
        myPlayer.collideWithPlatform(pf.y)
      }
    })
    //solid wall
    
    myPlayer.render(this.ctx, -camera.offsetX, -camera.offsetY)
    
    
    requestAnimationFrame( this.render.bind(this) )
  }
}
export default (canvas, canvasSpec) => {
  const game = new DashingGame(canvas, canvasSpec, {})
  clearInterval(game.spawnEnemy)
  return game
}