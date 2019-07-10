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


class DashingGame extends Game {
  constructor(canvas, canvasSpec, initGameProp) {
    super(canvas, canvasSpec, initGameProp)
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
    myPlayer.render(this.ctx)
    //
    //
    platforms.forEach(pf => {
      pf.render(this.ctx)
      const collideRes = checkPlayerCollideWithPlatform(myPlayer, pf)
      if(collideRes) {
        if(UITextBox) {
          UITextBox.innerText = collideRes
        }
        myPlayer.collideWithPlatform(pf.y)
      }
    })
    
    
    
    requestAnimationFrame( this.render.bind(this) )
  }
}
export default (canvas, canvasSpec) => {
  const game = new DashingGame(canvas, canvasSpec, {})
  clearInterval(game.spawnEnemy)
  return game
}