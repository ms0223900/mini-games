import {  
  Game
} from '../game/gameLib'
import {  
  PF01, PF02, PF03,
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
  render() {
    this.ctx.clearRect(0, 0, this.canvasSpec.width, this.canvasSpec.height)
    this.drawBG()
    this.drawFPS()
    //
    PF01.render(this.ctx)
    PF02.render(this.ctx)
    PF03.render(this.ctx)
    //
    myPlayer.render(this.ctx)
    //
    const collideRes = checkPlayerCollideWithPlatform(myPlayer, PF01)
    if(collideRes) {
      if(UITextBox) {
        UITextBox.innerText = collideRes
      }
      myPlayer.setProp('movement', {
        ...myPlayer.movement,
        isMove: false,
      })
      myPlayer.setProp('y', PF01.y - myPlayer.height)
    }
    
    
    
    requestAnimationFrame( this.render.bind(this) )
  }
}
export default (canvas, canvasSpec) => {
  const game = new DashingGame(canvas, canvasSpec, {})
  clearInterval(game.spawnEnemy)
  return game
}